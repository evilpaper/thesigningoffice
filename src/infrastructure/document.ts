import fs from "node:fs/promises";
import path from "node:path";

type DocumentStorageKind = "local" | "bucket";

const LOCAL_UPLOAD_ROOT = path.join("public", "uploads");

function localDocumentPath(key: string): string {
  return path.join(LOCAL_UPLOAD_ROOT, key);
}

function getDocumentStorageKind(): DocumentStorageKind {
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
  const filePath = localDocumentPath(key);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, bytes);
}

async function deleteDocumentLocally(key: string): Promise<void> {
  const filePath = localDocumentPath(key);
  await fs.unlink(filePath);
}

export async function storeDocument(input: {
  bytes: Uint8Array;
  key: string;
}): Promise<void> {
  switch (getDocumentStorageKind()) {
    case "local":
      await storeDocumentLocally(input.bytes, input.key);
      return;
    case "bucket":
      throw new Error("Document bucket storage is not configured yet.");
  }
}

export async function deleteDocument(key: string): Promise<void> {
  switch (getDocumentStorageKind()) {
    case "local":
      await deleteDocumentLocally(key);
      return;
    case "bucket":
      throw new Error("Document bucket storage is not configured yet.");
  }
}

export const documentStore = {
  store: storeDocument,
  delete: deleteDocument,
};
