import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // Supabase Storage (vehicle images, dealer logos)
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            // Any other https image source (CDN, external stock photos)
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
