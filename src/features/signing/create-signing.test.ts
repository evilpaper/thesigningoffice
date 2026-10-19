import { describe, expect, it, vi } from "vitest";
import {
  type CreateSigningCommand,
  type CreateSigningPorts,
  createSigning,
} from "./create-signing";
import type { Signer } from "./prepare-values";

/**
 * When prepare is submitted, createSigning stores Document bytes then persists
 * Signing metadata via SigningRepository — never bytes in Postgres — then asks
 * each Signer via Mailer. Failures return a closed union; compensating delete
 * on repository failure.
 */

const signingId = "550e8400-e29b-41d4-a716-446655440000";
const storedKey = "stored-document-key";
const bytes = new Uint8Array([1, 2, 3]);
const signers: Signer[] = [
  {
    name: "Ada Lovelace",
    taxIdentificationNumber: "198001011231",
    email: "ada@example.com",
  },
];
const createdSigning = {
  id: signingId,
  documentName: "Employment contract",
  signerEmails: ["ada@example.com"],
};

type FakePorts = CreateSigningPorts & {
  documentStore: {
    store: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  signingRepository: {
    create: ReturnType<typeof vi.fn>;
  };
  mailer: {
    sendForSigning: ReturnType<typeof vi.fn>;
  };
};

function fakePorts(overrides?: {
  store?: ReturnType<typeof vi.fn>;
  delete?: ReturnType<typeof vi.fn>;
  create?: ReturnType<typeof vi.fn>;
  sendForSigning?: ReturnType<typeof vi.fn>;
}): FakePorts {
  return {
    documentStore: {
      store: overrides?.store ?? vi.fn(async () => storedKey),
      delete: overrides?.delete ?? vi.fn(async (_key: string) => {}),
    },
    signingRepository: {
      create:
        overrides?.create ??
        vi.fn(
          async (_input: {
            signingId: string;
            documentName: string;
            message: string;
            signers: Signer[];
            documentKey: string;
          }) => createdSigning,
        ),
    },
    mailer: {
      sendForSigning:
        overrides?.sendForSigning ?? vi.fn(async (_input: unknown) => {}),
    },
  } as FakePorts;
}

function validCommand(
  overrides?: Partial<{
    bytes: Uint8Array;
    documentName: string;
    message: string;
    signers: Signer[];
  }>,
): CreateSigningCommand {
  return {
    signingId,
    document: {
      bytes: overrides?.bytes ?? bytes,
      fileName: "contract.pdf",
    },
    values: {
      documentName: overrides?.documentName ?? "Employment contract",
      message: overrides?.message ?? "Please sign",
      signers: overrides?.signers ?? signers,
    },
  };
}

describe("createSigning", () => {
  it("stores Document bytes then creates Signing metadata with the key from DocumentStore", async () => {
    const ports = fakePorts();

    const result = await createSigning(validCommand(), ports);

    expect(ports.documentStore.store).toHaveBeenCalledWith({
      bytes,
      signingId,
      fileName: "contract.pdf",
    });

    expect(ports.signingRepository.create).toHaveBeenCalledWith({
      signingId,
      documentName: "Employment contract",
      message: "Please sign",
      signers,
      documentKey: storedKey,
    });

    expect(ports.documentStore.store.mock.invocationCallOrder[0]).toBeLessThan(
      ports.signingRepository.create.mock.invocationCallOrder[0],
    );

    expect(result).toEqual({ ok: true, signing: createdSigning });
  });

  it("asks each Signer after the Signing is persisted", async () => {
    const ports = fakePorts();
    const secondSigner: Signer = {
      name: "Grace Hopper",
      taxIdentificationNumber: "198001011231",
      email: "grace@example.com",
    };

    const result = await createSigning(
      validCommand({ signers: [...signers, secondSigner] }),
      ports,
    );

    expect(ports.mailer.sendForSigning).toHaveBeenCalledTimes(2);
    expect(ports.mailer.sendForSigning).toHaveBeenNthCalledWith(1, {
      to: "ada@example.com",
      subject: "Employment contract",
      body: "Employment contract\n\nPlease sign",
    });
    expect(ports.mailer.sendForSigning).toHaveBeenNthCalledWith(2, {
      to: "grace@example.com",
      subject: "Employment contract",
      body: "Employment contract\n\nPlease sign",
    });
    expect(
      ports.signingRepository.create.mock.invocationCallOrder[0],
    ).toBeLessThan(ports.mailer.sendForSigning.mock.invocationCallOrder[0]);
    expect(result).toEqual({ ok: true, signing: createdSigning });
  });

  it("asks with Document name only when Message is empty", async () => {
    const ports = fakePorts();

    await createSigning(validCommand({ message: "" }), ports);

    expect(ports.mailer.sendForSigning).toHaveBeenCalledWith({
      to: "ada@example.com",
      subject: "Employment contract",
      body: "Employment contract",
    });
  });

  it("returns invalidInput with zero I/O when prepare values fail validation", async () => {
    const ports = fakePorts();

    const result = await createSigning(
      validCommand({ documentName: "   ", signers }),
      ports,
    );

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
    expect(ports.documentStore.store).not.toHaveBeenCalled();
    expect(ports.documentStore.delete).not.toHaveBeenCalled();
    expect(ports.signingRepository.create).not.toHaveBeenCalled();
    expect(ports.mailer.sendForSigning).not.toHaveBeenCalled();
  });

  it("returns invalidDocument with zero I/O when Document bytes are empty", async () => {
    const ports = fakePorts();

    const result = await createSigning(
      validCommand({ bytes: new Uint8Array() }),
      ports,
    );

    expect(result).toEqual({ ok: false, reason: "invalidDocument" });
    expect(ports.documentStore.store).not.toHaveBeenCalled();
    expect(ports.documentStore.delete).not.toHaveBeenCalled();
    expect(ports.signingRepository.create).not.toHaveBeenCalled();
    expect(ports.mailer.sendForSigning).not.toHaveBeenCalled();
  });

  it("returns storageFailed and does not call the repository when store fails", async () => {
    const ports = fakePorts({
      store: vi.fn().mockRejectedValue(new Error("disk full")),
    });

    const result = await createSigning(validCommand(), ports);

    expect(result).toEqual({ ok: false, reason: "storageFailed" });
    expect(ports.signingRepository.create).not.toHaveBeenCalled();
    expect(ports.documentStore.delete).not.toHaveBeenCalled();
    expect(ports.mailer.sendForSigning).not.toHaveBeenCalled();
  });

  it("deletes the Document and returns databaseUnavailable when repository create fails", async () => {
    const ports = fakePorts({
      create: vi.fn().mockRejectedValue(new Error("postgres down")),
    });

    const result = await createSigning(validCommand(), ports);

    expect(ports.documentStore.delete).toHaveBeenCalledWith(storedKey);
    expect(ports.mailer.sendForSigning).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      reason: "databaseUnavailable",
      documentOrphaned: false,
    });
  });

  it("returns databaseUnavailable with documentOrphaned when compensating delete fails", async () => {
    const ports = fakePorts({
      create: vi.fn().mockRejectedValue(new Error("postgres down")),
      delete: vi.fn().mockRejectedValue(new Error("delete failed")),
    });

    const result = await createSigning(validCommand(), ports);

    expect(ports.documentStore.delete).toHaveBeenCalledWith(storedKey);
    expect(ports.mailer.sendForSigning).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      reason: "databaseUnavailable",
      documentOrphaned: true,
    });
  });

  it("returns askFailed when the mailer fails after persist", async () => {
    const ports = fakePorts({
      sendForSigning: vi.fn().mockRejectedValue(new Error("resend down")),
    });

    const result = await createSigning(validCommand(), ports);

    expect(ports.signingRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ ok: false, reason: "askFailed" });
  });
});
