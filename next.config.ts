import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Who's Building form used to live at /idea-box.
      { source: "/idea-box", destination: "/whos-building", permanent: true },
    ];
  },
};

export default nextConfig;
