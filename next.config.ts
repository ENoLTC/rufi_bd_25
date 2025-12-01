import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: '/rufi_bd_25',
  assetPrefix: '/rufi_bd_25/',
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
