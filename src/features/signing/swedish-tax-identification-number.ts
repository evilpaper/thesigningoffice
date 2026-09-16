/**
 * Swedish personnummer / samordningsnummer helpers for Tax identification number.
 * Normalizes valid input to 12 digits (YYYYMMDDNNNC). International concept;
 * this module is the Sweden-only validator used for now.
 */

const DIGITS_ONLY = /^\d+$/;

function isValidCalendarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Luhn over the 10-digit YYMMDDNNNC form used by Skatteverket. */
function hasValidChecksum(tenDigits: string): boolean {
  let sum = 0;

  for (let index = 0; index < 10; index += 1) {
    let digit = Number(tenDigits[index]);
    if (index % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Pick century so the birth date falls in a rolling ~100-year window ending today.
 */
export function centuryForTwoDigitYear(
  twoDigitYear: number,
  now: Date = new Date(),
): number {
  const currentYear = now.getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  let fullYear = currentCentury + twoDigitYear;

  if (fullYear > currentYear) {
    fullYear -= 100;
  }

  return Math.floor(fullYear / 100);
}

/**
 * Returns a 12-digit Tax identification number, or null if not a valid
 * Swedish personnummer / samordningsnummer.
 */
export function normalizeSwedishTaxIdentificationNumber(
  raw: string,
  now: Date = new Date(),
): string | null {
  const compact = raw.trim().replace(/[\s-]/g, "");

  if (!DIGITS_ONLY.test(compact)) {
    return null;
  }

  let twelveDigits: string;

  if (compact.length === 12) {
    twelveDigits = compact;
  } else if (compact.length === 10) {
    const yy = Number(compact.slice(0, 2));
    const century = centuryForTwoDigitYear(yy, now);
    twelveDigits = `${century}${compact}`;
  } else {
    return null;
  }

  const year = Number(twelveDigits.slice(0, 4));
  const month = Number(twelveDigits.slice(4, 6));
  let day = Number(twelveDigits.slice(6, 8));

  // Samordningsnummer: day is birth day + 60.
  if (day > 60) {
    day -= 60;
  }

  if (!isValidCalendarDate(year, month, day)) {
    return null;
  }

  const tenDigits = twelveDigits.slice(2);
  if (!hasValidChecksum(tenDigits)) {
    return null;
  }

  return twelveDigits;
}
