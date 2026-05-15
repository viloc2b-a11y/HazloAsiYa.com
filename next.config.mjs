/** @type {import('next').NextConfig} */
// `output: 'export'`: redirects/rewrites de next.config no se emiten en el estático.
// Redirect www → apex vive en Cloudflare (reglas de host), no aquí.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Sin `next/image` en el proyecto; export estático + unoptimized evita el optimizador.
  // No usar `hostname: '**'` (riesgo DoS en configuraciones con optimizador remoto).
  images: {
    unoptimized: true,
  },
  // Prevent ESLint warnings (e.g. react/no-unescaped-entities) from failing the Cloudflare Pages build.
  // TypeScript errors are still caught by `tsc --noEmit` in CI.
  eslint: {
    ignoreDuringBuilds: true,
  },
}
export default nextConfig
