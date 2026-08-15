import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
const parsedApiUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;
type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function createRemotePattern(url: URL): RemotePattern {
  return {
    protocol: url.protocol === "http:" ? "http" : "https",
    hostname: url.hostname,
    port: url.port,
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
  ...(parsedApiUrl ? [createRemotePattern(parsedApiUrl)] : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
