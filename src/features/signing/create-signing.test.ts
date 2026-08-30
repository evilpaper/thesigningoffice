import { describe, expect, it, vi } from "vitest";
import { createSigning } from "./create-signing";

/**
 * When someone starts a Signing, the orchestrator should hand the bytes to something that knows how to store Documents — with this key and these bytes.
 * - createSigning = product logic (“derive a key, store the Document, later also save Signing state”)
 * - DocumentStore = “something that can store/delete Document bytes”
 * - src/lib/document.ts = the real implementation for prod (local disk or bucket)
 */

describe("createSigning", () => {
  it("stores the Document bytes under a key derived from the Signing id and file name", async () => {
    const documentStore = {
      store: vi.fn(),
      delete: vi.fn(),
    };

    const signingId = "550e8400-e29b-41d4-a716-446655440000";
    const bytes = new Uint8Array([1, 2, 3]);

    const result = await createSigning({
      signingId,
      bytes,
      fileName: "contract.pdf",
      documentStore,
    });

    expect(documentStore.store).toHaveBeenCalledWith({
      bytes,
      key: "documents/550e8400-e29b-41d4-a716-446655440000.pdf",
    });

    expect(result).toEqual({ ok: true, signingId });
  });
});
