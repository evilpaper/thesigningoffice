import { describe, expect, it } from "vitest";
import { createSigning } from "./create-signing";

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
