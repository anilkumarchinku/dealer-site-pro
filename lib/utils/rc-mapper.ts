/**
 * RC Data Mapper
 * Maps RC lookup data to vehicle database fields for draft creation
 */

import type { DBVehicle, AddVehiclePayload } from "@/lib/db/vehicles";

export interface RCData {
    rc_number: string;
    owner_name?: string;
    registration_date?: string;
    vehicle_class?: string;
    fuel_type?: string;
    make_model?: string;
    engine_number?: string;
    chassis_number?: string;
    color?: string;
    insurance_upto?: string;
    insurance_company?: string;
    insurance_policy_number?: string;
    insurance_policy_type?: string;
    fitness_upto?: string;
    rc_validity_upto?: string;
    owner_count?: number;
    challan_count?: number;
    challan_status?: string;
    state?: string;
    rto?: string;
    blacklisted?: boolean;
    noc_details?: string;
    rc_status?: string;
    tax_upto?: string;
    financer?: string;
    body_type?: string;
    seating_capacity?: string | number;
    challans?: Array<{
        challan_number?: string;
        offense_details?: string;
        challan_place?: string | null;
        challan_date?: string;
        amount?: number | string;
        challan_status?: string | null;
        state?: string;
    }>;
}

/**
 * Known two-word manufacturers
 * Used to correctly split "Maruti Suzuki Swift" → make: "Maruti Suzuki", model: "Swift"
 */
const TWO_WORD_MANUFACTURERS = [
    'Maruti Suzuki',
    'Tata Motors',
    'Mercedes-Benz',
    'Land Rover',
    'Force Motors',
];

/**
 * Parse "make model" string into separate make and model
 * Handles two-word manufacturers like "Maruti Suzuki"
 *
 * Examples:
 * - "Maruti Suzuki Swift" → { make: "Maruti Suzuki", model: "Swift" }
 * - "Hyundai Creta" → { make: "Hyundai", model: "Creta" }
 * - "Tata Motors Nexon" → { make: "Tata Motors", model: "Nexon" }
 */
export function parseMakeModel(makeModel: string): { make: string; model: string } {
    const trimmed = makeModel.trim();

    // Check for two-word manufacturers
    for (const manufacturer of TWO_WORD_MANUFACTURERS) {
        if (trimmed.toLowerCase().startsWith(manufacturer.toLowerCase())) {
            const model = trimmed.slice(manufacturer.length).trim();
            return {
                make: manufacturer,
                model: model || trimmed, // fallback to full string if no model part
            };
        }
    }

    // Single-word manufacturer - split at first space
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
        // No space - treat entire string as make
        return { make: trimmed, model: trimmed };
    }

    return {
        make: trimmed.slice(0, spaceIndex),
        model: trimmed.slice(spaceIndex + 1).trim(),
    };
}

/**
 * Convert Indian date format DD/MM/YYYY to ISO format YYYY-MM-DD
 * Returns null for invalid dates
 */
export function parseIndianDate(dateStr: string): string | null {
    const trimmed = dateStr?.trim();
    if (!trimmed) return null;

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
            return null;
        }
        return `${year}-${month}-${day}`;
    }

    // Handle DD/MM/YYYY or DD-MM-YYYY
    const parts = trimmed.split(/[/-]/);
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    // Basic validation
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
        return null;
    }

    // Pad with zeros
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Derive insurance status from expiry date
 */
export function deriveInsuranceStatus(
    validUntil: string | null,
    fallback: DBVehicle["insurance_status"] = "unknown"
): DBVehicle["insurance_status"] {
    if (!validUntil) return fallback;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(`${validUntil}T00:00:00`);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring_soon";
    return "active";
}

/**
 * Extract year from registration date
 * Falls back to current year if unable to parse
 */
export function extractYearFromRegistrationDate(registrationDate: string): number {
    const isoDate = parseIndianDate(registrationDate);
    if (!isoDate) return new Date().getFullYear();

    const year = parseInt(isoDate.split('-')[0], 10);
    return isNaN(year) ? new Date().getFullYear() : year;
}

/**
 * Validate RC data has minimum required fields for draft creation
 */
export function validateRCDataForDraft(rcData: RCData): { valid: boolean; error?: string } {
    if (!rcData.rc_number) {
        return { valid: false, error: "RC number is required" };
    }

    if (!rcData.make_model) {
        return { valid: false, error: "Vehicle make and model are required" };
    }

    if (rcData.blacklisted) {
        return { valid: false, error: "Cannot add blacklisted vehicle to inventory" };
    }

    return { valid: true };
}

/**
 * Map RC lookup data to vehicle payload for draft creation
 * Only maps available fields - dealer must fill in missing info
 */
export function mapRCToVehiclePayload(
    rcData: RCData,
    dealerId: string
): Omit<AddVehiclePayload, 'price_paise'> & { status: 'draft'; price_paise?: number } {
    const { make, model } = parseMakeModel(rcData.make_model || "");
    const insuranceValidUntil = parseIndianDate(rcData.insurance_upto || "");
    const year = rcData.registration_date
        ? extractYearFromRegistrationDate(rcData.registration_date)
        : new Date().getFullYear();

    return {
        dealer_id: dealerId,
        registration_number: rcData.rc_number,
        make,
        model,
        year,
        color: rcData.color || undefined,
        fuel_type: rcData.fuel_type || undefined,
        insurance_provider: rcData.insurance_company || undefined,
        insurance_valid_until: insuranceValidUntil || undefined,
        insurance_status: insuranceValidUntil
            ? deriveInsuranceStatus(insuranceValidUntil)
            : "unknown",
        insurance_last_checked_at: new Date().toISOString(),
        condition: "used", // RC lookup implies used vehicle
        status: "draft", // Mark as draft - requires dealer completion
        features: [],
    };
}
