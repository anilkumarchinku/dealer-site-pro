import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md";
}

export default function BrandLogo({ className = "", showText = true, size = "md" }: BrandLogoProps) {
    const iconSize = size === "sm" ? 28 : 36;
    const textSize = size === "sm" ? "text-base" : "text-lg";

    return (
        <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
            <Image
                src="/dealersite-pro-shield.png"
                alt="DealerSite Pro"
                width={iconSize}
                height={iconSize}
                className="h-auto w-auto object-contain"
                priority
            />
            {showText && (
                <span className={cn("font-black tracking-tight text-foreground", textSize)}>
                    DealerSite <span className="text-blue-600 dark:text-blue-400">Pro</span>
                </span>
            )}
        </Link>
    );
}
