'use client';

import { Play, Eye, Tv2, UserCheck } from 'lucide-react';

interface VideoSectionProps {
    brandColor: string;
    videoUrl?: string;
    brandName: string;
    vehicleType?: '2w' | '3w' | '4w';
}

const STATS = [
    { icon: Eye, label: '360° Walkaround' },
    { icon: Tv2, label: 'Live Demo Available' },
    { icon: UserCheck, label: 'Expert Guidance' },
];

function extractYouTubeId(url: string): string | null {
    // Handles:
    //   https://www.youtube.com/watch?v=VIDEO_ID
    //   https://youtu.be/VIDEO_ID
    //   https://www.youtube.com/embed/VIDEO_ID
    const patterns = [
        /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
        /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function buildEmbedUrl(videoUrl: string): string {
    const id = extractYouTubeId(videoUrl);
    if (id) return `https://www.youtube.com/embed/${id}`;
    // If it's already an embed URL or unknown, return as-is
    return videoUrl;
}

export function VideoSection({
    brandColor,
    videoUrl,
    brandName,
    vehicleType: _vehicleType,
}: VideoSectionProps) {
    if (videoUrl) {
        const embedUrl = buildEmbedUrl(videoUrl);
        return (
            <section className="py-16 bg-gray-900">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Section header */}
                    <div className="text-center mb-8">
                        <span
                            className="text-sm font-semibold uppercase tracking-widest"
                            style={{ color: brandColor }}
                        >
                            Brand Video
                        </span>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
                            See {brandName} in Action
                        </h2>
                    </div>

                    {/* YouTube iframe — aspect-video */}
                    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            src={embedUrl}
                            title={`${brandName} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                </div>
            </section>
        );
    }

    // Promotional static fallback
    return (
        <section className="py-20 bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 text-center">
                {/* Play button */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#FF0000' }}
                        >
                            <Play className="w-10 h-10 text-white fill-white ml-1" />
                        </div>
                        {/* Pulse ring */}
                        <span
                            className="absolute inset-0 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: '#FF0000' }}
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    See {brandName} in Action
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-base mb-10">
                    Visit our showroom for a live demo — experience the power firsthand
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {STATS.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium"
                            >
                                <Icon className="w-4 h-4 opacity-80" style={{ color: brandColor }} />
                                {stat.label}
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity bg-green-600"
                >
                    <Play className="w-5 h-5 fill-white" />
                    Book a Showroom Visit
                </a>
            </div>
        </section>
    );
}
