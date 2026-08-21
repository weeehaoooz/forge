/**
 * Supported size scales for the badge.
 */
export type TalosBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Anchor positions for placing the badge relative to its host element.
 */
export type TalosBadgePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top'
  | 'bottom'
  | 'inline';

/**
 * Visual semantic variant presentation styles.
 */
export type TalosBadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'error'
  | 'info'
  | 'neutral'
  | 'subtle'
  | 'outline';

/**
 * Shape styling of the badge container.
 */
export type TalosBadgeShape = 'circle' | 'pill' | 'square';

/**
 * Formats badge content taking into account max threshold clamping, dot mode, and null values.
 *
 * @param content The raw badge content (number, string, or null/undefined)
 * @param max The maximum numerical threshold before displaying with a '+' post-script (e.g. 99+)
 * @param dot Whether the badge is operating in dot indicator mode
 * @returns The formatted string to be rendered inside the badge
 */
export function formatBadgeContent(
  content: string | number | null | undefined,
  max?: number | null,
  dot: boolean = false
): string {
  if (dot || content === null || content === undefined || content === '') {
    return '';
  }

  if (typeof content === 'number') {
    if (typeof max === 'number' && max >= 0 && content > max) {
      return `${max}+`;
    }
    return content.toString();
  }

  const trimmed = content.toString().trim();
  if (trimmed === '') {
    return '';
  }

  const parsedNumber = Number(trimmed);
  if (!isNaN(parsedNumber) && typeof max === 'number' && max >= 0) {
    if (parsedNumber > max) {
      return `${max}+`;
    }
  }

  return trimmed;
}
