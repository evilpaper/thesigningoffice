import fs from "node:fs/promises";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { documentStore } from "./document";

vi.mock("node:fs/promises", () => ({
  default: {
    mkdir: vi.fn(async () => undefined),
    writeFile: vi.fn(async () => undefined),
    unlink: vi.fn(async () => undefined),
  },
}));

const signingId = "550e8400-e29b-41d4-a716-446655440000";
const bytes = new Uint8Array([1, 2, 3]);

describe("documentStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DOCUMENT_STORAGE = "local";
  });

  it("stores bytes under documents/{signingId}{extension} and returns that key", async () => {
    const key = await documentStore.store({
      bytes,
      signingId,
      fileName: "nested/contract.pdf",
    });

    expect(key).toBe(`documents/${signingId}.pdf`);
    expect(fs.mkdir).toHaveBeenCalledWith(
      path.dirname(path.join("public", "uploads", key)),
      { recursive: true },
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join("public", "uploads", key),
      bytes,
    );
  });
});
