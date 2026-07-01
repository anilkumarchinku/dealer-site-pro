'use client'

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react'
import { RotateCw } from 'lucide-react'

interface Vehicle360GalleryProps {
    images: string[]
    alt: string
    accentColor: string
}

export function Vehicle360Gallery({ images, alt, accentColor }: Vehicle360GalleryProps) {
    const frames = useMemo(
        () => Array.from(new Set(images.filter(Boolean))).slice(0, 36),
        [images]
    )
    const [frame, setFrame] = useState(0)

    if (frames.length < 6) return null

    const max = frames.length - 1

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span
                        className="grid h-8 w-8 place-items-center rounded-full"
                        style={{ backgroundColor: `${accentColor}1f`, color: accentColor }}
                    >
                        <RotateCw className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-slate-900">360 gallery</p>
                        <p className="text-xs text-slate-500">Drag the slider to inspect every angle</p>
                    </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {frame + 1}/{frames.length}
                </span>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                <img src={frames[frame]} alt={`${alt} 360 view ${frame + 1}`} className="h-full w-full object-cover" />
            </div>

            <input
                type="range"
                min={0}
                max={max}
                value={frame}
                onChange={(event) => setFrame(Number(event.target.value))}
                aria-label={`${alt} 360 gallery frame`}
                className="mt-3 h-2 w-full cursor-ew-resize accent-current"
                style={{ color: accentColor }}
            />
        </div>
    )
}
