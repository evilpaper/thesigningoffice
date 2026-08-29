export async function createSigning(input: {
  signingId: string;
  bytes: Uint8Array;
  fileName: string;
}) {
  return { ok: true as const, signingId: input.signingId };
}
