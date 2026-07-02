import Image from "next/image";

import type { OnboardingVehicleSegment } from "@/lib/types";
import { getBrandInitials, getBrandLogoPath } from "@/lib/utils/brand-logos";
import { cn } from "@/lib/utils";

type BrandLogoMarkProps = {
    brand?: string;
    segment?: OnboardingVehicleSegment;
    className?: string;
    imageClassName?: string;
};

export function BrandLogoMark({
    brand,
    segment,
    className,
    imageClassName,
}: BrandLogoMarkProps) {
    const logoPath = getBrandLogoPath(brand, segment);

    return (
        <span
            className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#D8E0EA] bg-white text-sm font-black text-[#071436] shadow-[0_8px_18px_rgba(7,20,54,0.06)]",
                className
            )}
            aria-hidden="true"
        >
            {logoPath ? (
                <Image
                    src={logoPath}
                    alt=""
                    width={44}
                    height={44}
                    sizes="44px"
                    className={cn("h-8 w-8 object-contain", imageClassName)}
                    unoptimized
                />
            ) : (
                <span>{getBrandInitials(brand)}</span>
            )}
        </span>
    );
}
