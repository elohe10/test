/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Unsplash (used as placeholders until real photos are ready)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    turbo: {
      // Tell Turbopack this folder is the project root (fixes warning about multiple lockfiles)
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
