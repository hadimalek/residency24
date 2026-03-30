import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./prisma/**", "./node_modules/.prisma/**", "./node_modules/@prisma/client/**"],
  },
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
