/**
 * Converts a project name into a URL-safe slug,
 * e.g. "My Café API!" → "my-cafe-api".
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_MAX_LENGTH = 50;

/**
 * Returns a user-facing error message if the slug is invalid,
 * or `null` if it can be used.
 */
export function validateSlug(
  slug: string,
  existingSlugs: readonly string[]
): string | null {
  if (slug.length === 0) {
    return "Name must include at least one letter or number.";
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return `Slug must be ${SLUG_MAX_LENGTH} characters or fewer.`;
  }
  if (existingSlugs.includes(slug)) {
    return "A project with this slug already exists.";
  }
  return null;
}
