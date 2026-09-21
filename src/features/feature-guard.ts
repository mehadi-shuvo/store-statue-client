import {
  PUBLIC_FEATURE_ROUTE_RULES,
  isPublicFeatureEnabled,
} from "./feature-config";
import type { PublicFeature, PublicRouteMatcher } from "./feature-types";

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }

  return pathname || "/";
}

function matchesRoute(pathname: string, matcher: PublicRouteMatcher): boolean {
  const normalizedPathname = normalizePathname(pathname);
  const normalizedMatcher = normalizePathname(matcher.pathname);

  if (normalizedPathname === normalizedMatcher) {
    return true;
  }

  return Boolean(
    matcher.includeDescendants &&
      normalizedPathname.startsWith(`${normalizedMatcher}/`),
  );
}

export function getDisabledPublicFeature(
  pathname: string,
): PublicFeature | null {
  for (const rule of PUBLIC_FEATURE_ROUTE_RULES) {
    if (
      !isPublicFeatureEnabled(rule.feature) &&
      rule.routes.some((route) => matchesRoute(pathname, route))
    ) {
      return rule.feature;
    }
  }

  return null;
}
