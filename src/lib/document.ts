import fs from "node:fs/promises";
import path from "node:path";

type DocumentStorage = "local" | "bucket";

function getDocumentStorage(): DocumentStorage {
  const value = process.env.DOCUMENT_STORAGE ?? "local";
  if (value === "local" || value === "bucket") {
    return value;
  }

  throw new Error(
    `Invalid DOCUMENT_STORAGE value "${value}". Expected "local" or "bucket".`,
  );
}

export function createDocumentKey(signingId: string, fileName: string): string {
  const baseName = path.basename(fileName);
  const extension = path.extname(baseName);
  return `documents/${signingId}${extension}`;
}

async function storeDocumentLocally(
  bytes: Uint8Array,
  key: string,
): Promise<void> {
  const filePath = path.join("public", "uploads", key);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes);
}

export async function storeDocument(input: {
  bytes: Uint8Array;
  key: string;
}): Promise<void> {
  switch (getDocumentStorage()) {
    case "local":
      await storeDocumentLocally(input.bytes, input.key);
      return;
    case "bucket":
      throw new Error("Document bucket storage is not configured yet.");
  }
}
