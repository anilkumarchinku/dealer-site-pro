import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
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
        ],
    },
    // Security headers
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                ],
            },
        ]
    },
};

export default nextConfig;
