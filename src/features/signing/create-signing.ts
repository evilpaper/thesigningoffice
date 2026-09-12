import { createDocumentKey } from "@/infrastructure/document";
import type { DocumentStore, SigningRepository } from "./ports";
import type { Signer } from "./prepare-values";
import { validatePrepareSigningValues } from "./prepare-values";

export type CreateSigningResult =
  | { ok: true; signingId: string }
  | {
      ok: false;
      reason:
        | "invalidDocument"
        | "invalidInput"
        | "databaseUnavailable"
        | "storageFailed";
    };

export async function createSigning(input: {
  signingId: string;
  bytes: Uint8Array;
  fileName: string;
  documentName: string;
  message: string;
  signers: Signer[];
  documentStore: DocumentStore;
  signingRepository: SigningRepository;
}): Promise<CreateSigningResult> {
  const prepared = validatePrepareSigningValues({
    documentName: input.documentName,
    message: input.message,
    signers: input.signers,
  });

  if (!prepared.ok) {
    return prepared;
  }

  if (input.bytes.length === 0) {
    return { ok: false, reason: "invalidDocument" };
  }

  const documentKey = createDocumentKey(input.signingId, input.fileName);

  try {
    await input.documentStore.store({ bytes: input.bytes, key: documentKey });
  } catch {
    return { ok: false, reason: "storageFailed" };
  }

  try {
    await input.signingRepository.create({
      signingId: input.signingId,
      documentName: prepared.values.documentName,
      message: prepared.values.message,
      signers: prepared.values.signers,
      documentKey,
    });
  } catch {
    try {
      await input.documentStore.delete(documentKey);
    } catch {
      return { ok: false, reason: "storageFailed" };
    }

    return { ok: false, reason: "databaseUnavailable" };
  }

  return { ok: true, signingId: input.signingId };
}
