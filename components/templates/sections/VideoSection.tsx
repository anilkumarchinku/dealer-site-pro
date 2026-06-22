'use client';

import { MapPin } from 'lucide-react';
import { getContrastText } from '@/lib/utils/color-contrast';

interface VideoSectionProps {
    brandColor: string;
    videoUrl?: string;
    brandName: string;
    vehicleType?: '2w' | '3w' | '4w';
}

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
            <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Section header */}
                    <div className="text-center mb-8">
                        <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: brandColor }}>
                            Brand Video
                        </span>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                            See {brandName} in Action
                        </h2>
                        <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
                            Explore the lineup, design highlights, and showroom walkthrough in one place.
                        </p>
                    </div>

                    {/* YouTube iframe — aspect-video */}
                    <div
                        className="relative w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
                        style={{ paddingBottom: '56.25%' }}
                    >
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

    // No video supplied — show a simple, honest visit CTA instead of a fake
    // play button or invented "360° Walkaround" / "Live Demo" claims.
    const onBrandText = getContrastText(brandColor);
    return (
        <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    See {brandName} in Person
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto text-base mb-10">
                    Visit our showroom to explore the lineup and take a closer look.
                </p>

                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: brandColor, color: onBrandText }}
                >
                    <MapPin className="w-5 h-5" />
                    Book a Showroom Visit
                </a>
            </div>
        </section>
    );
}
