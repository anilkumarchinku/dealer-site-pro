import type { LucideIcon } from 'lucide-react';
import {
    Bike,
    Car as CarIcon,
    CheckCircle2,
    Cog,
    Gauge,
    LifeBuoy,
    MessageSquare,
    Package,
    RefreshCw,
    Shield,
    Truck,
    Wallet,
    Wrench,
    Zap,
} from 'lucide-react';
import { getVehicleLabels } from '@/lib/utils/vehicle-labels';

export type TemplateServiceMeta = {
    label: string;
    icon: LucideIcon;
    desc: string;
};

function vehicleIcon(vehicleType?: '2w' | '3w' | '4w'): LucideIcon {
    if (vehicleType === '2w') return Bike;
    if (vehicleType === '3w') return Truck;
    return CarIcon;
}

function fallbackLabel(serviceKey: string): string {
    return serviceKey
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

export function getTemplateServiceMeta(
    serviceKey: string,
    vehicleType?: '2w' | '3w' | '4w',
): TemplateServiceMeta {
    const vl = getVehicleLabels(vehicleType);
    const VehicleIcon = vehicleIcon(vehicleType);
    const newVehicleLabel = vehicleType === '2w'
        ? 'New Bikes'
        : vehicleType === '3w'
            ? 'New Autos'
            : vl.newVehicle;
    const usedVehicleLabel = vehicleType === '2w'
        ? 'Used Bikes'
        : vehicleType === '3w'
            ? 'Used Autos'
            : vl.usedVehicle;

    const labels: Record<string, TemplateServiceMeta> = {
        new_car_sales: {
            label: newVehicleLabel,
            icon: VehicleIcon,
            desc: vl.newVehicleDesc,
        },
        used_car_sales: {
            label: usedVehicleLabel,
            icon: RefreshCw,
            desc: 'Certified pre-owned vehicles at fair prices',
        },
        financing: {
            label: 'Finance & EMI',
            icon: Wallet,
            desc: 'Easy monthly plans and loan support',
        },
        service_maintenance: {
            label: 'Service & Repairs',
            icon: Wrench,
            desc: 'Workshop support and regular maintenance',
        },
        parts_accessories: {
            label: 'Parts & Accessories',
            icon: Cog,
            desc: 'Genuine parts and useful upgrades',
        },
        body_shop: {
            label: 'Body Shop',
            icon: Wrench,
            desc: 'Repair and restoration assistance',
        },
        express_service: {
            label: 'Express Service',
            icon: Zap,
            desc: 'Fast service for routine jobs',
        },
        insurance: {
            label: 'Insurance',
            icon: Shield,
            desc: 'Insurance quotes and renewal support',
        },
        fleet_sales: {
            label: 'Fleet Sales',
            icon: Truck,
            desc: 'Bulk and business purchase support',
        },
        home_test_drives: {
            label: 'Home Test Drives',
            icon: Gauge,
            desc: 'Try the vehicle at your convenience',
        },
        extended_warranties: {
            label: 'Extended Warranty',
            icon: CheckCircle2,
            desc: 'Extra protection after purchase',
        },
        trade_in: {
            label: 'Trade-In',
            icon: RefreshCw,
            desc: vl.exchangeDesc,
        },
        get_callback: {
            label: 'Request Callback',
            icon: MessageSquare,
            desc: 'Get a quick call from the dealer',
        },
        buy_accessories: {
            label: 'Buy Accessories',
            icon: Package,
            desc: 'Add-ons and accessories assistance',
        },
        test_drive: {
            label: vl.testDrive,
            icon: Gauge,
            desc: vl.testDriveDesc,
        },
        roadside_assistance: {
            label: 'Roadside Assist',
            icon: LifeBuoy,
            desc: 'Help when you are stuck on the road',
        },
        car_exchange: {
            label: vl.exchange,
            icon: RefreshCw,
            desc: vl.exchangeDesc,
        },
    };

    return labels[serviceKey] ?? {
        label: fallbackLabel(serviceKey),
        icon: VehicleIcon,
        desc: 'Dealer support service',
    };
}
