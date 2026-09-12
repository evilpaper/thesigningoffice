"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { documentStore } from "@/infrastructure/document";
import { createSigning } from "./create-signing";
import type { SigningRepository } from "./ports";

export type StartSigningState =
  | { ok: true; signingId: string }
  | { ok: false; reason: "invalidDocument" }
  | null;

/** Stub until prepare submit wires a real SigningRepository (out of scope for #8). */
const stubSigningRepository: SigningRepository = {
  async create() {},
};

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

  // Pick-to-create is not the product path (ADR 0007). Without prepare Signers
  // this fails validation; full Nästa → createSigning wire-up is out of scope.
  const result = await createSigning({
    signingId,
    bytes: buffer,
    fileName: document.name,
    documentName: document.name,
    message: "",
    signers: [],
    documentStore,
    signingRepository: stubSigningRepository,
  });

  if (result.ok) {
    revalidatePath("/");
    return result;
  }

  return { ok: false, reason: "invalidDocument" };
}
