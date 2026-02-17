/**
 * Car Data Aggregator
 * Reads all JSON files from lib/data/sample-cars and generates a single TypeScript export file
 */

const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'lib/data/sample-cars');
const OUTPUT_FILE = path.join(process.cwd(), 'lib/data/cars.ts');

async function generateAggregator() {
    console.log('Generating aggregator...');

    try {
        const brands = await fs.readdir(DATA_DIR);
        const validBrands = [];
        let importStatements = `import type { Car } from '@/lib/types/car';\n\n`;
        let allCarsArray = `export const allCars: Car[] = [\n`;
        let count = 0;

        // Sort brands alphabetically
        brands.sort();

        for (const brand of brands) {
            // Skip hidden files or files (we expect directories)
            if (brand.startsWith('.') || brand.endsWith('.ts') || brand.endsWith('.js')) continue;

            const brandPath = path.join(DATA_DIR, brand);
            const stats = await fs.stat(brandPath);

            if (stats.isDirectory()) {
                validBrands.push(brand);

                const models = await fs.readdir(brandPath);
                models.sort();

                for (const modelFile of models) {
                    if (!modelFile.endsWith('.json')) continue;

                    const filePath = path.join(brandPath, modelFile);
                    const fileContent = await fs.readFile(filePath, 'utf-8');

                    // Add to array
                    allCarsArray += `  ${fileContent.trim()},\n`;
                    count++;
                }
            }
        }

        allCarsArray += `];\n\n`;

        // Helper functions
        const helpers = `
/**
 * Get cars by make/brand
 */
export function getCarsByMake(make: string): Car[] {
  return allCars.filter(car => car.make.toLowerCase() === make.toLowerCase());
}

/**
 * Get single car by ID
 */
export function getCarById(id: string): Car | undefined {
  return allCars.find(car => car.id === id);
}

/**
 * Get all unique makes
 */
export function getAllMakes(): string[] {
  return Array.from(new Set(allCars.map(car => car.make))).sort();
}

/**
 * Get cars count by make
 */
export function getCarCountByMake(): Record<string, number> {
  const counts: Record<string, number> = {};
  allCars.forEach(car => {
    counts[car.make] = (counts[car.make] || 0) + 1;
  });
  return counts;
}

/**
 * Sample Featured Cars (for homepage)
 */
export const featuredCars = allCars
  .sort((a, b) => b.pricing.exShowroom.min - a.pricing.exShowroom.min) // Sort by price desc as proxy for "featured"
  .slice(0, 6);

/**
 * Latest Launches
 */
export const latestCars = allCars
  .slice(0, 8); // Just take first 8 for now

// Export brand specific arrays for easy access
export const marutiSuzukiCars = allCars.filter(c => c.make === 'Maruti Suzuki');
`;

        const finalContent = importStatements + allCarsArray + helpers;

        await fs.writeFile(OUTPUT_FILE, finalContent);
        console.log(`✅ Generated lib/data/cars.ts with ${count} cars from ${validBrands.length} brands`);

    } catch (error) {
        console.error('Failed to generate aggregator:', error);
    }
}

generateAggregator();
