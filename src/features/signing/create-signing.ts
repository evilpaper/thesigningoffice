import { createDocumentKey } from "@/lib/document";

/**
 * This is a port type.
 * A port is a contract between the application and the outside world.
 * When you add SigningRepository, extract both port types to something like src/features/signing/ports.ts.
 * That's the natural trigger ADR-0001 describes — not before.
 */
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
