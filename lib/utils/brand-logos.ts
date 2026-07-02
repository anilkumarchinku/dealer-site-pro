import type { OnboardingVehicleSegment } from "@/lib/types";

const anyBrandLogos: Record<string, string> = {
    "audi": "/assets/logos/audi.png",
    "bmw": "/assets/logos/bmw.png",
    "byd": "/assets/logos/byd.png",
    "honda": "/assets/logos/honda.png",
    "hyundai": "/assets/logos/hyundai.png",
    "kia": "/assets/logos/kia.png",
    "mahindra": "/assets/logos/mahindra.png",
    "maruti suzuki": "/assets/logos/maruti-suzuki.png",
    "mercedes-benz": "/assets/logos/mercedes-benz.png",
    "mg": "/assets/logos/mg.png",
    "tata motors": "/assets/logos/tata-motors.png",
    "toyota": "/assets/logos/toyota.png",
};

const segmentBrandLogos: Partial<Record<OnboardingVehicleSegment, Record<string, string>>> = {
    "2w": {
        "ampere": "/data/brand-logos/ampere-greaves.png",
        "ather energy": "/assets/logos/2w/ather-energy.svg",
        "bajaj": "/assets/logos/2w/bajaj-auto.svg",
        "hero motocorp": "/assets/logos/2w/hero-motocorp.svg",
        "honda": "/assets/logos/2w/honda-motorcycles.svg",
        "ola electric": "/assets/logos/2w/ola-electric.svg",
        "revolt motors": "/data/brand-logos/revolt-motors.png",
        "river": "/data/brand-logos/river-ev.png",
        "royal enfield": "/assets/logos/2w/royal-enfield.svg",
        "suzuki": "/assets/logos/2w/suzuki-motorcycle.svg",
        "tvs": "/assets/logos/2w/tvs-motor.svg",
        "yamaha": "/assets/logos/2w/yamaha.svg",
    },
    "3w": {
        "altigreen": "/data/brand-logos/altigreen.png",
        "atul auto": "/data/brand-logos/atul-auto.png",
        "bajaj": "/data/brand-logos/bajaj-auto-3w.png",
        "euler motors": "/data/brand-logos/euler-motors.png",
        "kinetic green": "/data/brand-logos/kinetic-green.png",
        "mahindra": "/data/brand-logos/mahindra-3w.png",
        "montra electric": "/data/brand-logos/montra-ev.png",
        "omega seiki": "/data/brand-logos/omega-seiki-mobility.png",
        "piaggio": "/assets/logos/piaggio.png",
        "terra motors": "/data/brand-logos/terra-motors.png",
        "tvs": "/data/brand-logos/tvs-king.png",
        "yc electric": "/data/brand-logos/yc-ev.png",
    },
};

function normalizeBrand(value: string) {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, " ")
        .trim();
}

export function getBrandLogoPath(brand?: string, segment?: OnboardingVehicleSegment) {
    if (!brand) return undefined;

    const key = normalizeBrand(brand);
    return (segment ? segmentBrandLogos[segment]?.[key] : undefined) ?? anyBrandLogos[key];
}

export function getBrandInitials(brand?: string) {
    if (!brand) return "DS";

    const words = brand
        .replace(/[-/]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) return "DS";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
}
