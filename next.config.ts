import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "",
  // Enable React strict mode
  reactStrictMode: true,
  // Ensure trailing slashes for static hosting
  trailingSlash: true,
};

export default nextConfig;
