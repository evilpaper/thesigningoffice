"use server";

import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";

export async function startSigning(formData: FormData) {
  const document = formData.get("document");
  if (!(document instanceof File) || document.size === 0) {
    return;
  }

  const arrayBuffer = await document.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await fs.writeFile(`./public/uploads/${document.name}`, buffer);

  revalidatePath("/");
}
