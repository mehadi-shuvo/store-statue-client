import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiHostname = apiBaseUrl ? new URL(apiBaseUrl).hostname : null;
type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function createRemotePattern(hostname: string): RemotePattern {
  return {
    protocol: "https",
    hostname,
    pathname: "/**",
  };
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.pexels.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "i.ibb.co.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  ...(apiHostname ? [createRemotePattern(apiHostname)] : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
