/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production'
const developmentScriptSources = isDevelopment ? " 'unsafe-eval'" : ''
const developmentConnectSources = isDevelopment
  ? ' http://localhost:* ws://localhost:* ws://127.0.0.1:* http://127.0.0.1:*'
  : ''
const posthogConnectSource = process.env.NEXT_PUBLIC_POSTHOG_HOST
  ? ` ${process.env.NEXT_PUBLIC_POSTHOG_HOST}`
  : ''

const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  swcMinify: true,
  transpilePackages: ['three', '@tanstack/react-query'],
  experimental: {
    optimizePackageImports: [
      'three',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'framer-motion',
      'lucide-react',
      'zod',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bksonxnxshxinqffswqc.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.paypalobjects.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githack.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp', 'image/png'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline'${developmentScriptSources} https://www.paypal.com https://www.paypalobjects.com https://*.chatbase.co https://fonts.googleapis.com https://accounts.google.com https://va.vercel-scripts.com https://vercel.live https://*.vercel.live https://*.pusher.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live; img-src 'self' data: https: blob: https://vercel.live https://*.vercel.live; font-src 'self' https://fonts.gstatic.com data: https://vercel.live https://assets.vercel.com; connect-src 'self'${developmentConnectSources}${posthogConnectSource} https://bksonxnxshxinqffswqc.supabase.co https://api.resend.com https://api.groq.com https://generativelanguage.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com https://api.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://*.chatbase.co https://va.vercel-scripts.com https://raw.githack.com https://raw.githubusercontent.com https://vercel.live https://*.vercel.live https://*.pusher.com https://sockjs-mt1.pusher.com wss://*.pusher.com https://us.i.posthog.com https://eu.i.posthog.com https://*.posthog.com wss://*.posthog.com; frame-src 'self' https://www.paypal.com https://www.paypalobjects.com https://www.sandbox.paypal.com https://accounts.google.com https://*.chatbase.co https://vercel.live https://*.vercel.live; worker-src 'self' blob:; manifest-src 'self' https://vercel.com https://*.vercel.app; form-action 'self' https://www.paypal.com https://www.paypalobjects.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
          },
        ],
      },
      {
        source: '/auth/callback',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      // Caching estratégico para API
      {
        source: '/api/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      // Caching inmutable para assets estáticos
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Sin cache para webhooks
      {
        source: '/api/paypal-webhook',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/api/webhooks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
