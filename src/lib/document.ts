import { randomUUID } from "node:crypto";
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

function createDocumentKey(fileName: string): string {
  const baseName = path.basename(fileName);
  const extension = path.extname(baseName);
  return `documents/${randomUUID()}${extension}`;
}

async function storeDocumentLocally(
  bytes: Uint8Array,
  fileName: string,
): Promise<{ key: string }> {
  const key = createDocumentKey(fileName);
  const filePath = path.join("public", "uploads", key);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes);

  return { key };
}

export async function storeDocument(input: {
  bytes: Uint8Array;
  fileName: string;
}): Promise<{ key: string }> {
  switch (getDocumentStorage()) {
    case "local":
      return storeDocumentLocally(input.bytes, input.fileName);
    case "bucket":
      throw new Error("Document bucket storage is not configured yet.");
  }
}
