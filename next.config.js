/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");



/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,

  },

  images: {
    remotePatterns: [
      {
        hostname: "127.0.0.1",
      },
      { hostname: "localhost" },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default config;
