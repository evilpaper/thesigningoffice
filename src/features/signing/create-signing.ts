import { createDocumentKey } from "@/lib/document";

export type DocumentStore = {
  store(input: { bytes: Uint8Array; key: string }): Promise<void>;
  delete(key: string): Promise<void>;
};

export async function createSigning(input: {
  signingId: string;
  bytes: Uint8Array;
  fileName: string;
  documentStore: DocumentStore;
}) {
  const key = createDocumentKey(input.signingId, input.fileName);
  await input.documentStore.store({ bytes: input.bytes, key });

  return { ok: true as const, signingId: input.signingId };
}
