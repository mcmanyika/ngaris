import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep firebase-admin (and its CJS deps) outside the Turbopack server bundle.
  // Bundling pulls ESM-only `jose@6` into `jwks-rsa` via require() and crashes auth routes.
  serverExternalPackages: [
    "firebase-admin",
    "jose",
    "jwks-rsa",
    "@google-cloud/firestore",
    "@google-cloud/storage",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
