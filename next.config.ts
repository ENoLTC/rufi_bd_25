import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true, // GitHub Pages не поддерживает оптимизацию изображений
  },
  basePath: '/rufi_bd_25', // Замените на имя вашего репозитория
  assetPrefix: '/rufi_bd_25/',
}

export default nextConfig;
