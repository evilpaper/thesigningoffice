"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { storeDocument } from "@/lib/document";
import { createSigning } from "./create-signing";

export async function startSigning(formData: FormData) {
  const document = formData.get("document");

  if (!(document instanceof File) || document.size === 0) {
    return;
  }

  const signingId = randomUUID();
  const arrayBuffer = await document.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const result = await createSigning({
    signingId,
    bytes: buffer,
    fileName: document.name,
    documentStore: { store: storeDocument, delete: async () => {} },
  });

  if (result.ok) {
    revalidatePath("/");
  }
}
