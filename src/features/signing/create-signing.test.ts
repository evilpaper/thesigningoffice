import { describe, expect, it, vi } from "vitest";
import { createSigning } from "./create-signing";

/**
 * When prepare is submitted, createSigning stores Document bytes then persists
 * Signing metadata (Draft) via SigningRepository — never bytes in Postgres.
 */

describe("createSigning", () => {
  it("stores Document bytes then creates Signing metadata with documentKey", async () => {
    const documentStore = {
      store: vi.fn(),
      delete: vi.fn(),
    };
    const signingRepository = {
      create: vi.fn(),
    };

    const signingId = "550e8400-e29b-41d4-a716-446655440000";
    const bytes = new Uint8Array([1, 2, 3]);
    const signers = [
      {
        name: "Ada Lovelace",
        taxIdentificationNumber: "198001011234",
        email: "ada@example.com",
      },
    ];

    const result = await createSigning({
      signingId,
      bytes,
      fileName: "contract.pdf",
      documentName: "Employment contract",
      message: "Please sign",
      signers,
      documentStore,
      signingRepository,
    });

    expect(documentStore.store).toHaveBeenCalledWith({
      bytes,
      key: "documents/550e8400-e29b-41d4-a716-446655440000.pdf",
    });

    expect(signingRepository.create).toHaveBeenCalledWith({
      signingId,
      documentName: "Employment contract",
      message: "Please sign",
      signers,
      documentKey: "documents/550e8400-e29b-41d4-a716-446655440000.pdf",
    });

    expect(documentStore.store.mock.invocationCallOrder[0]).toBeLessThan(
      signingRepository.create.mock.invocationCallOrder[0],
    );

    expect(result).toEqual({ ok: true, signingId });
  });
});
