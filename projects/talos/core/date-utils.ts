/**
 * Shared date utility helpers wrapping date-fns.
 *
 * All functions are pure and tree-shakeable.
 * Moment.js tokens (YYYY, DD, etc.) are automatically normalised to the
 * Unicode/UTS-35 tokens that date-fns expects (yyyy, dd, etc.).
 */

import { format as dfFormat, isValid as dfIsValid, parse as dfParse } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────
// Token normalisation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts Moment.js format tokens to their date-fns UTS-35 equivalents.
 * This lets consumers continue passing legacy strings like 'YYYY-MM-DD'
 * without any configuration change.
 *
 * Key differences handled:
 *  - YYYY → yyyy  (calendar year, not ISO week year)
 *  - YY   → yy    (2-digit year)
 *  - DD   → dd    (day of month, not day of year)
 *  - D    → d     (day of month, not day of year)
 *  - dddd → EEEE  (full weekday name)
 *  - ddd  → EEE   (abbreviated weekday)
 *  - A    → a     (AM/PM)
 */
export function normalizeDateFnsToken(fmt: string): string {
  return fmt
    .replace(/YYYY/g, 'yyyy')
    .replace(/YY/g, 'yy')
    .replace(/\bDD\b/g, 'dd')
    .replace(/\bD\b/g, 'd')
    .replace(/dddd/g, 'EEEE')
    .replace(/ddd/g, 'EEE')
    .replace(/\bA\b/g, 'a');
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a Date value with automatic Moment→date-fns token normalisation.
 * Returns an empty string for null/undefined/invalid input.
 */
export function formatDate(date: Date | null | undefined, fmt: string): string {
  if (!date || !dfIsValid(date)) return '';
  return dfFormat(date, normalizeDateFnsToken(fmt));
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_FORMATS = [
  'yyyy-MM-dd HH:mm:ss',
  'yyyy-MM-dd HH:mm',
  'yyyy-MM-dd hh:mm a',
  'yyyy-MM-dd',
  'MM/dd/yyyy HH:mm',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'yyyy/MM/dd',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD'
];

/**
 * Attempt to parse a value into a valid Date, trying multiple format strings.
 * Returns null for blank/falsy input or unparseable strings.
 *
 * @param val      Raw value from form control (string | Date | number | null | undefined)
 * @param formats  Optional array of format strings to try first (Moment tokens OK)
 */
export function parseFlexibleDate(
  val: unknown,
  formats: string[] = []
): Date | null {
  if (val === null || val === undefined || val === '') return null;

  // Already a Date
  if (val instanceof Date) {
    return dfIsValid(val) ? val : null;
  }

  // Number (unix ms timestamp)
  if (typeof val === 'number') {
    const d = new Date(val);
    return dfIsValid(d) ? d : null;
  }

  // String — try explicit formats first, then fallbacks
  if (typeof val === 'string') {
    const allFormats = [...formats, ...FALLBACK_FORMATS];
    const referenceDate = new Date();

    for (const fmt of allFormats) {
      const normFmt = normalizeDateFnsToken(fmt);
      try {
        const parsed = dfParse(val, normFmt, referenceDate);
        if (dfIsValid(parsed) && parsed.getFullYear() > 1900) {
          return parsed;
        }
      } catch {
        // try next format
      }
    }

    // Last resort — ISO / native Date constructor
    const native = new Date(val);
    return dfIsValid(native) ? native : null;
  }

  return null;
}
