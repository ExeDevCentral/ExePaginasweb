/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production'
const developmentScriptSources = isDevelopment ? " 'unsafe-eval'" : ''
const developmentConnectSources = isDevelopment
  ? ' http://localhost:* ws://localhost:* ws://127.0.0.1:* http://127.0.0.1:*'
  : ''

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['three'],
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
              `default-src 'self'; script-src 'self' 'unsafe-inline'${developmentScriptSources} https://www.paypal.com https://www.paypalobjects.com https://*.chatbase.co https://fonts.googleapis.com https://accounts.google.com https://va.vercel-scripts.com https://vercel.live https://*.vercel.live https://*.pusher.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live; img-src 'self' data: https: blob: https://vercel.live https://*.vercel.live; font-src 'self' https://fonts.gstatic.com data: https://vercel.live https://assets.vercel.com; connect-src 'self'${developmentConnectSources} https://bksonxnxshxinqffswqc.supabase.co https://api.resend.com https://api.groq.com https://generativelanguage.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com https://api.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://*.chatbase.co https://va.vercel-scripts.com https://raw.githack.com https://raw.githubusercontent.com https://vercel.live https://*.vercel.live https://*.pusher.com https://sockjs-mt1.pusher.com wss://*.pusher.com; frame-src 'self' https://www.paypal.com https://www.paypalobjects.com https://www.sandbox.paypal.com https://accounts.google.com https://*.chatbase.co https://vercel.live https://*.vercel.live; worker-src 'self' blob:; manifest-src 'self' https://vercel.com https://*.vercel.app; form-action 'self' https://www.paypal.com https://www.paypalobjects.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
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
    ]
  },
}

export default nextConfig
