'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * next/image that fades in once the image finishes loading.
 *
 * Drop-in replacement for <Image>: forwards all props. Uses the `.img-fade-in`
 * class from globals.css and toggles `.is-loaded` on load. Falls back to visible
 * immediately under reduced-motion (handled in CSS). Handles cached images that
 * are already complete on mount.
 */
export function FadeInImage({ className, onLoad, ...props }: ImageProps) {
    const [loaded, setLoaded] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        // Cached images may already be decoded before React attaches the load handler.
        if (imgRef.current?.complete) setLoaded(true);
    }, []);

    return (
        <Image
            ref={imgRef}
            className={cn('img-fade-in', loaded && 'is-loaded', className)}
            onLoad={(e) => {
                setLoaded(true);
                onLoad?.(e);
            }}
            {...props}
        />
    );
}
