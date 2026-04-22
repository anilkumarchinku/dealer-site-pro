/**
 * BikeDetailHeroImage — Client component for hero image with fallback chain.
 * Tries each URL in imageUrls sequentially; shows placeholder on full failure.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bike } from 'lucide-react';

interface BikeDetailHeroImageProps {
    imageUrls: string[];
    alt: string;
}

export function BikeDetailHeroImage({ imageUrls, alt }: BikeDetailHeroImageProps) {
    const [imgIdx, setImgIdx] = useState(0);
    const [failed, setFailed] = useState(false);

    function handleError() {
        if (imgIdx < imageUrls.length - 1) {
            setImgIdx(imgIdx + 1);
        } else {
            setFailed(true);
        }
    }

    if (failed || imageUrls.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Bike className="w-16 h-16 text-gray-400" />
            </div>
        );
    }

    return (
        <Image
            src={imageUrls[imgIdx]}
            alt={alt}
            fill
            className="object-contain"
            onError={handleError}
            unoptimized
            priority
        />
    );
}
