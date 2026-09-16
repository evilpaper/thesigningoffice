import { describe, expect, it } from "vitest";
import {
  type PrepareSigningValues,
  validatePrepareSigningValues,
} from "./prepare-values";

/** Valid Swedish personnummer (normalized 12-digit form). */
const VALID_TIN = "198001011231";

const validValues = (): PrepareSigningValues => ({
  documentName: "contract.pdf",
  message: "Please sign",
  signers: [
    {
      name: "Ada Lovelace",
      taxIdentificationNumber: VALID_TIN,
      email: "ada@example.com",
    },
  ],
});

describe("validatePrepareSigningValues", () => {
  it("accepts a Document name, optional Message, and complete Signers", () => {
    const result = validatePrepareSigningValues(validValues());

    expect(result).toEqual({ ok: true, values: validValues() });
  });

  it("trims Document name, Message, and Signer fields on success", () => {
    const result = validatePrepareSigningValues({
      documentName: "  contract.pdf  ",
      message: "  Please sign  ",
      signers: [
        {
          name: "  Ada Lovelace  ",
          taxIdentificationNumber: "  19800101-1231  ",
          email: "  ada@example.com  ",
        },
      ],
    });

    expect(result).toEqual({
      ok: true,
      values: {
        documentName: "contract.pdf",
        message: "Please sign",
        signers: [
          {
            name: "Ada Lovelace",
            taxIdentificationNumber: VALID_TIN,
            email: "ada@example.com",
          },
        ],
      },
    });
  });

  it("normalizes a 10-digit Swedish Tax identification number to 12 digits", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [
        {
          name: "Ada Lovelace",
          taxIdentificationNumber: "8001011231",
          email: "ada@example.com",
        },
      ],
    });

    expect(result).toEqual({
      ok: true,
      values: validValues(),
    });
  });

  it("rejects an empty Document name", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      documentName: "   ",
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("rejects when there are no Signers", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [],
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("rejects when any Signer field is blank", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [
        {
          name: "Ada Lovelace",
          taxIdentificationNumber: "",
          email: "ada@example.com",
        },
      ],
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("rejects a Tax identification number that fails Swedish validation", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [
        {
          name: "Ada Lovelace",
          taxIdentificationNumber: "198001011234",
          email: "ada@example.com",
        },
      ],
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("allows an empty Message", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      message: "",
    });

    expect(result).toEqual({
      ok: true,
      values: { ...validValues(), message: "" },
    });
  });

  it("rejects a Signer email that is not a simple email shape", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [
        {
          name: "Ada Lovelace",
          taxIdentificationNumber: VALID_TIN,
          email: "not-an-email",
        },
      ],
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("rejects more than eight Signers", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: Array.from({ length: 9 }, (_, index) => ({
        name: `Signer ${index + 1}`,
        taxIdentificationNumber: VALID_TIN,
        email: `signer${index + 1}@example.com`,
      })),
    });

    expect(result).toEqual({ ok: false, reason: "invalidInput" });
  });

  it("accepts eight Signers", () => {
    const signers = Array.from({ length: 8 }, (_, index) => ({
      name: `Signer ${index + 1}`,
      taxIdentificationNumber: VALID_TIN,
      email: `signer${index + 1}@example.com`,
    }));

    const result = validatePrepareSigningValues({
      ...validValues(),
      signers,
    });

    expect(result).toEqual({
      ok: true,
      values: { ...validValues(), signers },
    });
  });

  it("allows duplicate Tax identification numbers across Signers", () => {
    const result = validatePrepareSigningValues({
      ...validValues(),
      signers: [
        {
          name: "Ada Lovelace",
          taxIdentificationNumber: VALID_TIN,
          email: "ada@example.com",
        },
        {
          name: "Ada Again",
          taxIdentificationNumber: "19800101-1231",
          email: "ada2@example.com",
        },
      ],
    });

    expect(result).toEqual({
      ok: true,
      values: {
        ...validValues(),
        signers: [
          {
            name: "Ada Lovelace",
            taxIdentificationNumber: VALID_TIN,
            email: "ada@example.com",
          },
          {
            name: "Ada Again",
            taxIdentificationNumber: VALID_TIN,
            email: "ada2@example.com",
          },
        ],
      },
    });
  });
});
