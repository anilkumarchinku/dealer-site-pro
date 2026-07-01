/**
 * BikeDetailHeroImage — Client component for hero image with fallback chain.
 * Tries each URL in imageUrls sequentially; hides media on full failure.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

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

    if (failed || imageUrls.length === 0) return null;

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
