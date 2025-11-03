import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.flashme.lk",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
