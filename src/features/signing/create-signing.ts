import { createDocumentKey, storeDocument } from "@/lib/document";

export async function createSigning(input: {
  signingId: string;
  bytes: Uint8Array;
  fileName: string;
}) {
  const key = createDocumentKey(input.signingId, input.fileName);
  await storeDocument({ bytes: input.bytes, key });

  return { ok: true as const, signingId: input.signingId };
}
