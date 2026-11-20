/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/explore",
        destination: "/buyer/explore",
      },
      {
        source: "/farmers",
        destination: "/buyer/farmers",
      },
    ];
  },
};

module.exports = nextConfig;
