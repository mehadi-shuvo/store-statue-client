import { getDisabledPublicFeature } from "@/features/feature-guard";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const disabledFeature = getDisabledPublicFeature(request.nextUrl.pathname);

  if (!disabledFeature) {
    return NextResponse.next();
  }

  const unavailableUrl = new URL("/service-unavailable", request.url);
  unavailableUrl.searchParams.set("feature", disabledFeature);

  const response = NextResponse.redirect(unavailableUrl);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
