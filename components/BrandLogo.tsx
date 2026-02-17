'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car } from 'lucide-react'

interface BrandLogoProps {
    className?: string
    showText?: boolean
}

export default function BrandLogo({ className = '', showText = true }: BrandLogoProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link
            href="/"
            className={`flex items-center gap-3 group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Container with Transition */}
            <div className="relative w-20 h-20 overflow-hidden">
                {/* Default Logo - BMW Car */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        isHovered
                            ? 'opacity-0 scale-95 rotate-6'
                            : 'opacity-100 scale-100 rotate-0'
                    }`}
                >
                    <Image
                        src="/assets/cars/bmw/5-series.jpg"
                        alt="DealerSite Pro"
                        width={80}
                        height={80}
                        className="rounded-xl object-contain"
                        unoptimized
                    />
                </div>

                {/* CyePro Logo - Shows on Hover */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        isHovered
                            ? 'opacity-100 scale-100 rotate-0'
                            : 'opacity-0 scale-95 -rotate-6'
                    }`}
                >
                    <Image
                        src="/assets/cyepro-logo.png"
                        alt="CyePro Solutions"
                        width={112}
                        height={112}
                        className="rounded-xl object-contain"
                        unoptimized
                    />
                </div>
            </div>

            {/* Text with Transition */}
            {showText && (
                <div className="relative overflow-hidden">
                    {/* DealerSite Pro Text */}
                    <span
                        className={`block text-lg font-bold transition-all duration-500 ease-in-out ${
                            isHovered
                                ? 'opacity-0 -translate-y-full'
                                : 'opacity-100 translate-y-0'
                        }`}
                    >
                        DealerSite Pro
                    </span>

                    {/* CyePro Solutions Text */}
                    <span
                        className={`absolute top-0 left-0 block text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
                            isHovered
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-full'
                        }`}
                    >
                        CyePro Solutions
                    </span>
                </div>
            )}

            {/* Hover Indicator */}
            <div
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-in-out ${
                    isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
            />
        </Link>
    )
}
