"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { documentStore } from "@/infrastructure/document";
import { createSigning } from "./create-signing";

export type StartSigningState =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" }
  | null;

export async function startSigning(
  _prevState: StartSigningState,
  formData: FormData,
): Promise<StartSigningState> {
  const document = formData.get("document");

  if (!(document instanceof File) || document.size === 0) {
    return { ok: false, reason: "invalidDocument" };
  }

  const signingId = randomUUID();
  const arrayBuffer = await document.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const result = await createSigning({
    signingId,
    bytes: buffer,
    fileName: document.name,
    documentStore,
  });

  if (result.ok) {
    revalidatePath("/");
    return result;
  }

  return result;
}
