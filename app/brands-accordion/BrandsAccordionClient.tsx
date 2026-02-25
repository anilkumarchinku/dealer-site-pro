'use client';

/**
 * BrandsAccordionClient
 * Renders all 28 brands using the BrandModelAccordion (Option B) design.
 * Each accordion card shows models + variant chips + spec sheet on click.
 */

import { BrandModelAccordion } from '@/components/cars/BrandModelAccordion';

const BRANDS: { key: string; display: string; color: string }[] = [
    { key: 'audi', display: 'Audi', color: '#C0392B' },
    { key: 'bentley', display: 'Bentley', color: '#2C5F2E' },
    { key: 'bmw', display: 'BMW', color: '#1C6EA4' },
    { key: 'byd', display: 'BYD', color: '#E63946' },
    { key: 'citroen', display: 'Cit­ro­ën', color: '#E63946' },
    { key: 'force_motors', display: 'Force Motors', color: '#2D4739' },
    { key: 'honda', display: 'Honda', color: '#CC0000' },
    { key: 'hyundai', display: 'Hyundai', color: '#002C5F' },
    { key: 'isuzu', display: 'Isuzu', color: '#CC0000' },
    { key: 'jaguar', display: 'Jaguar', color: '#1B4332' },
    { key: 'jeep', display: 'Jeep', color: '#1A1A1A' },
    { key: 'kia', display: 'Kia', color: '#05141F' },
    { key: 'lamborghini', display: 'Lamborghini', color: '#D4AF37' },
    { key: 'land_rover', display: 'Land Rover', color: '#1B3A4B' },
    { key: 'lexus', display: 'Lexus', color: '#1A1A1A' },
    { key: 'mahindra', display: 'Mahindra', color: '#CC0000' },
    { key: 'maruti_suzuki', display: 'Maruti Suzuki', color: '#003580' },
    { key: 'mercedes_benz', display: 'Mercedes-Benz', color: '#1C1C1C' },
    { key: 'mg', display: 'MG Motor', color: '#D62828' },
    { key: 'mini', display: 'MINI', color: '#1B1B1B' },
    { key: 'nissan', display: 'Nissan', color: '#C3002F' },
    { key: 'porsche', display: 'Porsche', color: '#C8102E' },
    { key: 'renault', display: 'Renault', color: '#EFDF00' },
    { key: 'tata', display: 'Tata Motors', color: '#003399' },
    { key: 'toyota', display: 'Toyota', color: '#CC0000' },
    { key: 'volkswagen', display: 'Volkswagen', color: '#001E50' },
    { key: 'volvo', display: 'Volvo', color: '#003057' },
    { key: 'bajaj', display: 'Bajaj', color: '#003366' },
];

export function BrandsAccordionClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {BRANDS.map((brand) => (
                <BrandModelAccordion
                    key={brand.key}
                    brandKey={brand.key}
                    brandDisplay={brand.display}
                    brandColor={brand.color}
                />
            ))}
        </div>
    );
}
