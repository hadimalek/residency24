import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
