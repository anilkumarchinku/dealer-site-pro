/**
 * Accurate color data for 3-Wheeler models.
 * Keyed as "Brand Model" (matching brand + model fields in three-wheelers.ts).
 * Colors reflect real manufacturer offerings — commercial autos (Yellow/Black),
 * cargo vehicles (commercial colors), EVs (White/Blue/Green palette).
 */

export interface ThreeWheelerModelColor {
    name: string
    hex: string
}

export const THREE_WHEELER_MODEL_COLORS: Record<string, ThreeWheelerModelColor[]> = {

    // ── Bajaj Auto ────────────────────────────────────────────────────────────
    "Bajaj Auto (3W) RE CNG": [
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Bottle Green",     hex: "#2E6B3E" },
    ],
    "Bajaj Auto (3W) RE LPG": [
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Yellow",           hex: "#FFD700" },
    ],
    "Bajaj Auto (3W) RE Diesel": [
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Ivory White",      hex: "#FFFFF0" },
    ],
    "Bajaj Auto (3W) RE Electric": [
        { name: "Lime Green",       hex: "#5DB85D" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
    ],
    "Bajaj Auto (3W) Maxima Z CNG": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "Black",            hex: "#1A1A1A" },
    ],
    "Bajaj Auto (3W) Compact RE CNG": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Black",            hex: "#1A1A1A" },
    ],
    "Bajaj Auto (3W) Maxima XL Electric": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
    ],
    "Bajaj Auto (3W) Maxima X Wide Diesel": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Bajaj Auto (3W) Maxima C CNG": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "Black",            hex: "#1A1A1A" },
    ],
    "Bajaj Auto (3W) GoGo": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "Ocean Blue",       hex: "#1B6CA8" },
    ],
    "Bajaj Auto (3W) Riki P40": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],

    // ── Piaggio Ape ───────────────────────────────────────────────────────────
    "Piaggio Ape Auto Classic": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Ivory White",      hex: "#FFFFF0" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Piaggio Ape Auto DX": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Ivory White",      hex: "#FFFFF0" },
        { name: "Piaggio Red",      hex: "#C0272D" },
    ],
    "Piaggio Ape NXT+": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Piaggio Red",      hex: "#C0272D" },
        { name: "Ocean Blue",       hex: "#1B6CA8" },
    ],
    "Piaggio Ape Metro": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Piaggio Ape Xtra LDX Diesel": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Piaggio Ape Xtra LDX CNG": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Piaggio Ape E-City": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Aqua Green",       hex: "#4CAF7D" },
    ],
    "Piaggio Ape E-Xtra FX": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Piaggio Ape E-Xtra FX Max": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Silver Blue",      hex: "#7FB3D3" },
    ],

    // ── TVS King ──────────────────────────────────────────────────────────────
    "TVS King King Deluxe": [
        { name: "Glossy Yellow",    hex: "#F5C800" },
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Glossy White",     hex: "#F0F0F0" },
    ],
    "TVS King King Duramax": [
        { name: "Glossy Yellow",    hex: "#F5C800" },
        { name: "Black",            hex: "#1A1A1A" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "TVS King King Duramax Plus": [
        { name: "Glossy Yellow",    hex: "#F5C800" },
        { name: "Black",            hex: "#1A1A1A" },
        { name: "Flame Red",        hex: "#C0272D" },
    ],
    "TVS King King Kargo": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "TVS King King EV Max": [
        { name: "Glossy White",     hex: "#F0F0F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Matte Black",      hex: "#2C2C2C" },
    ],
    "TVS King King Kargo HD EV": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],

    // ── Mahindra (3W) ─────────────────────────────────────────────────────────
    "Mahindra (3W) Alfa Passenger": [
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Ivory White",      hex: "#FFFFF0" },
    ],
    "Mahindra (3W) E-Alfa Plus": [
        { name: "Lime Green",       hex: "#5DB85D" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Mahindra (3W) E-Alfa Mini": [
        { name: "Lime Green",       hex: "#5DB85D" },
        { name: "Pearl White",      hex: "#F5F5F0" },
    ],
    "Mahindra (3W) Alfa Load": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Mahindra (3W) Zor Grand": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver Grey",      hex: "#9E9E9E" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Mahindra (3W) Treo": [
        { name: "Aqua Blue",        hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Matte Black",      hex: "#2C2C2C" },
    ],
    "Mahindra (3W) Treo Plus": [
        { name: "Aqua Blue",        hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Mahindra (3W) Treo Zor": [
        { name: "Aqua Blue",        hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Grey",             hex: "#9E9E9E" },
    ],
    "Mahindra (3W) Treo Yaari HRT": [
        { name: "Aqua Blue",        hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
    ],
    "Mahindra (3W) Treo Yaari SFT": [
        { name: "Aqua Blue",        hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
    ],
    "Mahindra (3W) UDO": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Black",            hex: "#1A1A1A" },
        { name: "White",            hex: "#FFFFFF" },
    ],

    // ── Atul Auto ─────────────────────────────────────────────────────────────
    "Atul Auto Gem Paxx": [
        { name: "Black & Yellow",   hex: "#1A1A1A" },
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Atul Auto Elite Plus": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Atul Auto Rik Auto": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Black",            hex: "#1A1A1A" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Atul Auto Gem Cargo": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Atul Auto Shakti Cargo": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Atul Auto Rik Electric": [
        { name: "Lime Green",       hex: "#5DB85D" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],

    // ── Kinetic Green ─────────────────────────────────────────────────────────
    "Kinetic Green Safar Smart": [
        { name: "Saffron Orange",   hex: "#E87722" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Lime Green",       hex: "#5DB85D" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
    ],
    "Kinetic Green Super DX": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Kinetic Green Safar Shakti": [
        { name: "Saffron Orange",   hex: "#E87722" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Kinetic Green Safar Jumbo Ranger": [
        { name: "Saffron Orange",   hex: "#E87722" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
    ],

    // ── Lohia Auto ───────────────────────────────────────────────────────────
    "Lohia Auto Humsafar L5 Passenger": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Lohia Auto Narain ICE L3": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Lohia Auto Narain DX": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
    "Lohia Auto Humsafar L5 Cargo": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "Silver",           hex: "#C0C0C0" },
        { name: "White",            hex: "#FFFFFF" },
    ],
    "Lohia Auto Comfort F2F+": [
        { name: "Yellow",           hex: "#FFD700" },
        { name: "White",            hex: "#FFFFFF" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
    ],
    "Lohia Auto Youdha E5 Passenger": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Lohia Auto Youdha E5 Cargo": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],

    // ── Euler Motors ─────────────────────────────────────────────────────────
    "Euler Motors NEO HiCITY": [
        { name: "Aqua",             hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Dark Grey",        hex: "#424242" },
    ],
    "Euler Motors NEO HiRange": [
        { name: "Aqua",             hex: "#00BCD4" },
        { name: "Pearl White",      hex: "#F5F5F0" },
    ],
    "Euler Motors HiLoad DV EV": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Ocean Blue",       hex: "#1B6CA8" },
    ],
    "Euler Motors HiLoad EV 120": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Ocean Blue",       hex: "#1B6CA8" },
        { name: "Silver Grey",      hex: "#9E9E9E" },
    ],
    "Euler Motors HiLoad EV 170": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Ocean Blue",       hex: "#1B6CA8" },
        { name: "Dark Grey",        hex: "#424242" },
    ],

    // ── Greaves Electric Mobility ─────────────────────────────────────────────
    "Greaves Electric Mobility Eltra City": [
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Lime Green",       hex: "#5DB85D" },
    ],
    "Greaves Electric Mobility Eltra City XTRA": [
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Pearl White",      hex: "#F5F5F0" },
    ],
    "Greaves Electric Mobility Xargo": [
        { name: "Pearl White",      hex: "#F5F5F0" },
        { name: "Sky Blue",         hex: "#5B9BD5" },
        { name: "Silver",           hex: "#C0C0C0" },
    ],
}
