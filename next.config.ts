import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // فقط برای Docker — برای dev/npm start کامنت بشه
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
