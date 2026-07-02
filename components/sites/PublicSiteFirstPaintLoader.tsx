"use client";

import { useEffect, useState } from "react";
import { CarRentalLoadingAnimation } from "./CarRentalLoadingAnimation";

const FADE_MS = 320;
const FALLBACK_MS = 10000;

export function PublicSiteFirstPaintLoader() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (!window.location.pathname.startsWith("/sites/")) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        setIsVisible(true);

        const fallbackTimer = window.setTimeout(() => {
            completeLoader();
        }, FALLBACK_MS);

        return () => {
            window.clearTimeout(fallbackTimer);
        };
    }, []);

    function completeLoader() {
        setIsLeaving(true);

        window.setTimeout(() => {
            setIsVisible(false);
        }, FADE_MS);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div
            data-testid="public-site-first-paint-loader"
            className={`fixed inset-0 z-[2147483000] transition-opacity duration-300 ${isLeaving ? "opacity-0" : "opacity-100"}`}
        >
            <CarRentalLoadingAnimation
                label="Preparing your dealership website"
                sublabel="Setting up inventory, finance, and enquiry tools"
                loop={false}
                onAnimationComplete={() => completeLoader()}
            />
        </div>
    );
}
