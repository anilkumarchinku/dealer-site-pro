'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Brand logo with graceful fallback.
 *
 * Logo URLs are built optimistically (brandLogoUrl just string-builds a path),
 * so a brand without an asset file would otherwise render a broken <img>.
 * If the image 404s / fails to load, we fall back to a clean initial-letter
 * monogram instead of the browser's broken-image icon.
 */
export function BrandLogo({ name, src }: { name: string; src: string | null }) {
    const [failed, setFailed] = useState(false)
    const showImage = Boolean(src) && !failed

    return (
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            {showImage ? (
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                    <Image
                        src={src as string}
                        alt={name}
                        width={56}
                        height={56}
                        unoptimized
                        className="object-contain"
                        onError={() => setFailed(true)}
                    />
                </div>
            ) : (
                <div className="w-14 h-14 rounded-full bg-muted/50 border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                    <span className="text-primary text-xl font-bold">{name.charAt(0)}</span>
                </div>
            )}
        </div>
    )
}
