/**
 * Claim reminders are downloaded as `.ics` files. Token names and symbols are
 * arbitrary on-chain strings, so they must never be used verbatim in a
 * filename or in an iCalendar TEXT field.
 */

const FALLBACK_TOKEN = "token";
const MAX_FILE_NAME_PART_BYTES = 80;

// Invisible formatting characters (bidi overrides, zero-width joiners, BOM)
// can spoof the visible filename or break calendar clients.
const FORMAT_CHARS = /\p{Cf}/gu;
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/g;
// Windows reserves these device names even when an extension follows.
const RESERVED_WINDOWS_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

const utf8Length = (value: string): number => new TextEncoder().encode(value).length;

/**
 * Turns arbitrary token text into a single safe filename segment. Only letters,
 * numbers (any script), `_` and `-` survive; everything else is dropped or
 * collapsed into a hyphen, so path separators, dots, control characters, bidi
 * overrides and emoji cannot escape or disguise the name. Returns "token" when
 * nothing printable remains.
 */
export const safeFileNamePart = (raw: string | null | undefined): string => {
  let value = (raw ?? "")
    .normalize("NFKC")
    .replace(FORMAT_CHARS, "")
    .replace(CONTROL_CHARS, "")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  // Keep the complete download name well under the usual 255-byte limit.
  if (utf8Length(value) > MAX_FILE_NAME_PART_BYTES) {
    let truncated = "";
    let bytes = 0;
    for (const char of Array.from(value)) {
      const size = utf8Length(char);
      if (bytes + size > MAX_FILE_NAME_PART_BYTES) break;
      truncated += char;
      bytes += size;
    }
    value = truncated.replace(/[-_]+$/g, "");
  }

  if (value === "") return FALLBACK_TOKEN;
  if (RESERVED_WINDOWS_NAME.test(value)) return `${FALLBACK_TOKEN}-${value}`;
  return value;
};

/** `claim-[token]-reminder.ics`, safe to hand to an anchor's `download`. */
export const claimCalendarFileName = (token: string): string =>
  `claim-${safeFileNamePart(token)}-reminder.ics`;

/** RFC 5545 TEXT escaping: backslash, newline, semicolon and comma. */
const escapeIcsText = (value: string): string =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

const icsTimestamp = (timestampMs: number): string | null => {
  const date = new Date(timestampMs);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`;
};

/**
 * Builds the reminder calendar and its download name. Returns null when the
 * claim date is not a valid date, instead of throwing inside the click handler.
 */
export const buildClaimCalendar = ({
  token,
  claimAvailableMs,
}: {
  token: string;
  claimAvailableMs: number;
}): { fileName: string; content: string } | null => {
  const dtstart = icsTimestamp(claimAvailableMs);
  if (!dtstart) return null;

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${escapeIcsText(`Claim ${token}`)}`,
    `DTSTART:${dtstart}`,
    `DESCRIPTION:${escapeIcsText(`Claim your ${token} share`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return { fileName: claimCalendarFileName(token), content };
};
