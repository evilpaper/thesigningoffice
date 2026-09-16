import { createDocumentKey } from "@/infrastructure/document";
import type { DocumentStore, SigningRepository } from "./ports";
import type { PrepareSigningValues } from "./prepare-values";
import { validatePrepareSigningValues } from "./prepare-values";

export type CreateSigningCommand = {
  signingId: string;
  document: {
    bytes: Uint8Array;
    fileName: string;
  };
  values: PrepareSigningValues;
};

export type CreateSigningPorts = {
  documentStore: DocumentStore;
  signingRepository: SigningRepository;
};

export type CreateSigningResult =
  | { ok: true; signingId: string }
  | {
      ok: false;
      reason: "invalidDocument" | "invalidInput" | "storageFailed";
    }
  | {
      ok: false;
      reason: "databaseUnavailable";
      documentOrphaned: boolean;
    };

export async function createSigning(
  command: CreateSigningCommand,
  ports: CreateSigningPorts,
): Promise<CreateSigningResult> {
  const prepared = validatePrepareSigningValues(command.values);

  if (!prepared.ok) {
    return { ok: false, reason: "invalidInput" };
  }

  if (command.document.bytes.length === 0) {
    return { ok: false, reason: "invalidDocument" };
  }

  const documentKey = createDocumentKey(
    command.signingId,
    command.document.fileName,
  );

  try {
    await ports.documentStore.store({
      bytes: command.document.bytes,
      key: documentKey,
    });
  } catch {
    return { ok: false, reason: "storageFailed" };
  }

  try {
    await ports.signingRepository.create({
      signingId: command.signingId,
      documentName: prepared.values.documentName,
      message: prepared.values.message,
      signers: prepared.values.signers,
      documentKey,
    });
  } catch {
    try {
      await ports.documentStore.delete(documentKey);
    } catch {
      return {
        ok: false,
        reason: "databaseUnavailable",
        documentOrphaned: true,
      };
    }

    return {
      ok: false,
      reason: "databaseUnavailable",
      documentOrphaned: false,
    };
  }

  return { ok: true, signingId: command.signingId };
}
