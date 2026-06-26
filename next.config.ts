import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    outputFileTracingRoot: process.cwd(),
    // Exclude large static image directories from serverless function bundles.
    // These are served by Vercel's CDN as static assets — they must NOT be
    // traced into the function, or it blows past the 300 MB limit.
    outputFileTracingExcludes: {
        '*': [
            './public/data/brand-model-images/**',
            './public/data/brand-logos/**',
        ],
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
            // Cyepro DMS vehicle photos are served from S3 bucket hosts.
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'www.hyundai.com',
            },
            // CardDekho CDN (4W/3W car catalog images)
            {
                protocol: 'https',
                hostname: 'stimg.cardekho.com',
            },
            // BikeWale / AEPLCloud CDN (2W bike catalog images)
            {
                protocol: 'https',
                hostname: 'imgd.aeplcdn.com',
            },
            // BikeDekho CDN (2W bike catalog images — fallback)
            {
                protocol: 'https',
                hostname: 'cdn.bikedekho.com',
            },
            // V3Cars CDN (discontinued model fallback images)
            {
                protocol: 'https',
                hostname: 'www.v3cars.com',
            },
            // CardDekho Trucks CDN (3W vehicle catalog images)
            {
                protocol: 'https',
                hostname: 'truckcdn.cardekho.com',
            },
        ],
    },
    // Security headers
    async headers() {
        const scriptSrc = [
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            'https://checkout.razorpay.com',
            'https://unpkg.com',
        ].join(' ')
        const securityHeaders = [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
                key: 'Content-Security-Policy',
                value: [
                    "default-src 'self'",
                    // The design-system landing handoff loads React/Babel from unpkg
                    // until it is ported into compiled Next.js components.
                    scriptSrc,
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                    "img-src 'self' data: blob: https://*.supabase.co https://*.cyepro.com https://*.amazonaws.com https://lh3.googleusercontent.com https://images.unsplash.com https://storage.googleapis.com https://maps.googleapis.com https://*.cardekho.com https://*.aeplcdn.com https://*.bikedekho.com https://*.gaadi.com https://www.v3cars.com https://www.hyundai.com https://*.hyundai.com",
                    "font-src 'self' data: https://fonts.gstatic.com",
                    "connect-src 'self' https://*.supabase.co https://*.cyepro.com https://checkout.razorpay.com wss://*.supabase.co",
                    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.google.com https://maps.google.com",
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
