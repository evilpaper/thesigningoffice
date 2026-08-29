import { describe, expect, it, vi } from "vitest";
import { createSigning } from "./create-signing";

/**
 * vi.mock tells Vitest: when any code in this test file loads @/lib/document
 * use my fake storeDocument function instead of the real one.
 * The link is the import path string "@/lib/document".
 * It must match exactly what create-signing.ts imports.
 * Vitest swaps the module at load time, so when createSigning runs storeDocument(...).
 * It hits the mock, not the real filesystem code.
 */
vi.mock("@/lib/document", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/document")>();
  return {
    ...actual,
    storeDocument: vi.fn(),
  };
});

describe("createSigning", () => {
  it("creates a Signing when given document bytes and a file name", async () => {
    const result = await createSigning({
      signingId: "550e8400-e29b-41d4-a716-446655440000",
      bytes: new Uint8Array([1, 2, 3]),
      fileName: "contract.pdf",
    });

    expect(result).toEqual({
      ok: true,
      signingId: "550e8400-e29b-41d4-a716-446655440000",
    });
  });
});
