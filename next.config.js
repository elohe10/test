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
};

module.exports = nextConfig;
