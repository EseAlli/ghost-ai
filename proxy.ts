import { clerkMiddleware } from "@clerk/nextjs/server";

import { isPublicAuthPath } from "@/lib/auth-routes";

// Protect everything by default; only the sign-in and sign-up paths are public.
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicAuthPath(request.nextUrl.pathname)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
