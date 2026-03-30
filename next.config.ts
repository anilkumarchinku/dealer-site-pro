import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [
            // Supabase Storage (vehicle images, dealer logos)
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            // Cyepro vehicle images
            {
                protocol: 'https',
                hostname: '*.cyepro.com',
            },
            // Google user avatars (if used)
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            // Placeholder / stock photos
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            // CardDekho CDN (car catalog images)
            {
                protocol: 'https',
                hostname: 'stimg.cardekho.com',
            },
        ],
    },
    // Security headers
    async headers() {
        const securityHeaders = [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
            {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains',
            },
            {
                key: 'Content-Security-Policy',
                value: [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com",
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: blob: https://*.supabase.co https://*.cyepro.com https://lh3.googleusercontent.com https://images.unsplash.com https://storage.googleapis.com https://maps.googleapis.com",
                    "font-src 'self' data:",
                    "connect-src 'self' https://*.supabase.co https://api.cyepro.com https://checkout.razorpay.com wss://*.supabase.co",
                    "frame-src https://api.razorpay.com https://checkout.razorpay.com",
                    "media-src 'self' https://*.supabase.co",
                ].join('; '),
            },
        ]

        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ]
    },
};

// Only wrap with Sentry if DSN is configured — no-op otherwise
export default process.env.SENTRY_DSN
    ? withSentryConfig(nextConfig, {
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          // Silent during builds to avoid noisy output when DSN isn't configured
          silent: !process.env.CI,
          // Upload source maps for readable stack traces in Sentry
          widenClientFileUpload: true,
          sourcemaps: { deleteSourcemapsAfterUpload: true },
          disableLogger: true,
          automaticVercelMonitors: true,
      })
    : nextConfig;
