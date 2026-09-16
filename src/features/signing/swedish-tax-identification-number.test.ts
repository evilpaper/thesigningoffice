import { describe, expect, it } from "vitest";
import {
  centuryForTwoDigitYear,
  normalizeSwedishTaxIdentificationNumber,
} from "./swedish-tax-identification-number";

/** Valid personnummer: 1980-01-01, serial 123, check digit 1. */
const VALID_12 = "198001011231";
const VALID_10 = "8001011231";
/** Samordningsnummer for the same birth day (day 01 → 61). */
const VALID_SAMORDNING_12 = "198001611238";

describe("centuryForTwoDigitYear", () => {
  it("picks the century in a rolling 100-year window", () => {
    const now = new Date("2026-09-16T12:00:00Z");

    expect(centuryForTwoDigitYear(80, now)).toBe(19);
    expect(centuryForTwoDigitYear(26, now)).toBe(20);
    expect(centuryForTwoDigitYear(27, now)).toBe(19);
  });
});

describe("normalizeSwedishTaxIdentificationNumber", () => {
  it("accepts a 12-digit personnummer", () => {
    expect(normalizeSwedishTaxIdentificationNumber(VALID_12)).toBe(VALID_12);
  });

  it("accepts hyphenated and spaced input", () => {
    expect(normalizeSwedishTaxIdentificationNumber("19800101-1231")).toBe(
      VALID_12,
    );
    expect(normalizeSwedishTaxIdentificationNumber("800101-1231")).toBe(
      VALID_12,
    );
    expect(normalizeSwedishTaxIdentificationNumber("  1980 0101 1231  ")).toBe(
      VALID_12,
    );
  });

  it("normalizes 10-digit input with a rolling century", () => {
    const now = new Date("2026-09-16T12:00:00Z");
    expect(normalizeSwedishTaxIdentificationNumber(VALID_10, now)).toBe(
      VALID_12,
    );
  });

  it("accepts samordningsnummer", () => {
    expect(normalizeSwedishTaxIdentificationNumber(VALID_SAMORDNING_12)).toBe(
      VALID_SAMORDNING_12,
    );
  });

  it("rejects an invalid checksum", () => {
    expect(normalizeSwedishTaxIdentificationNumber("198001011234")).toBeNull();
  });

  it("rejects empty or non-digit input", () => {
    expect(normalizeSwedishTaxIdentificationNumber("")).toBeNull();
    expect(normalizeSwedishTaxIdentificationNumber("abcdefghijkl")).toBeNull();
  });

  it("rejects an impossible calendar date", () => {
    expect(normalizeSwedishTaxIdentificationNumber("198002301231")).toBeNull();
  });
});
