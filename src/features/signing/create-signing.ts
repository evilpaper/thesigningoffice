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

  const documentKey = createDocumentKey(input.signingId, input.fileName);
  await input.documentStore.store({ bytes: input.bytes, key: documentKey });

  await input.signingRepository.create({
    signingId: input.signingId,
    documentName: prepared.values.documentName,
    message: prepared.values.message,
    signers: prepared.values.signers,
    documentKey,
  });

  return { ok: true, signingId: input.signingId };
}
