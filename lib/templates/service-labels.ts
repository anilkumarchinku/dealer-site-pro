/**
 * Shared service-chip metadata for the dealer-site templates.
 * (Previously duplicated as a per-template SERVICE_LABELS map.)
 *
 * Returns label + icon + a short description for each dealer service code.
 * Templates that render plain chips ignore `desc`; the Family template uses it.
 * Labels are vehicle-type aware, so this takes the resolved vehicle labels.
 */
import type { LucideIcon } from 'lucide-react';
import {
    Car as CarIcon,
    RefreshCw,
    Wallet,
    Wrench,
    Cog,
    Gauge,
    Shield,
    CheckCircle2,
    LifeBuoy,
} from 'lucide-react';
import { getVehicleLabels } from '@/lib/utils/vehicle-labels';

export type VehicleLabels = ReturnType<typeof getVehicleLabels>;

export interface ServiceMeta {
    label: string;
    icon: LucideIcon;
    desc: string;
}

export function getServiceMeta(vl: VehicleLabels): Record<string, ServiceMeta> {
    return {
        new_car_sales: { label: vl.newVehicle, icon: CarIcon, desc: vl.newVehicleDesc },
        used_car_sales: { label: vl.usedVehicle, icon: RefreshCw, desc: 'Certified pre-owned at great prices' },
        financing: { label: 'Finance & EMI', icon: Wallet, desc: 'Easy monthly plans for every budget' },
        service_maintenance: { label: 'Service & Repairs', icon: Wrench, desc: 'Expert care for your vehicle' },
        parts_accessories: { label: 'Parts & Accessories', icon: Cog, desc: 'Genuine parts for all makes' },
        test_drive: { label: vl.testDrive, icon: Gauge, desc: vl.testDriveDesc },
        insurance: { label: 'Insurance', icon: Shield, desc: 'Complete vehicle protection plans' },
        extended_warranty: { label: 'Extended Warranty', icon: CheckCircle2, desc: 'Peace of mind, guaranteed' },
        roadside_assistance: { label: 'Roadside Assist', icon: LifeBuoy, desc: '24/7 support wherever you are' },
        car_exchange: { label: vl.exchange, icon: RefreshCw, desc: vl.exchangeDesc },
    };
}

/** Resolve a single service code to its metadata, with a safe fallback. */
export function resolveServiceMeta(code: string, vl: VehicleLabels): ServiceMeta {
    return getServiceMeta(vl)[code] ?? { label: code, icon: CarIcon, desc: 'Premium service for you' };
}
