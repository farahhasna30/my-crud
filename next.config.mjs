/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "indexsearch.sgp1.digitaloceanspaces.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
