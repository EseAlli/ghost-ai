/**
 * Public auth routes, sourced from Clerk's standard env vars.
 * Every route not listed here is protected by `proxy.ts`.
 */
export const SIGN_IN_URL =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";

export const SIGN_UP_URL =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

export const AFTER_AUTH_URL = "/editor";

const PUBLIC_AUTH_PATHS = [SIGN_IN_URL, SIGN_UP_URL];

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
