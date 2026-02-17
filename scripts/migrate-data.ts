
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: For massive writes or bypassing RLS, SERVICE_ROLE_KEY is better, 
// but we'll try with ANON key assuming we set the policy to allow inserts.

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCars() {
    console.log('Starting migration...');

    // Read cars.ts file content directly because we can't easily import TS in a standalone node script without compilation
    // Alternatively, we can use ts-node. Let's assume we can read the file and eval/parse it or just import it if running with ts-node.
    // Since we are likely running with `npx tsx` or similar, we can try dynamic import if module resolution works.

    // However, simpler approach for reliability here: Read the file, regex out the array, or better yet:
    // We can just import the data if we place this script in a way that allows importing from lib.
    // Let's try to import using dynamic import, assuming tsx handles aliases.

    try {
        // We'll read the file content and parse it because importing from 'lib/data/cars.ts' might be tricky due to aliases (@/)
        // effectively in a standalone script.

        // Actually, let's just attempt to import relative path.
        // We need to handle the @/ alias. 
        // Let's try reading the file and using a quick hack to parse the JSON-like object if import fails.
        // BUT `cars.ts` exports `allCars`.

        // For this script to work robustly, let's copy the data content structure or use a relative import.
        // The relative path from here (scripts/migrate-data.ts) to lib is ../lib/data/cars.ts

        // Issue: `cars.ts` imports `Car` from `@/lib/types/car`. That alias won't work in node without setup.
        // So reading string and parsing is safer.

        console.log('Reading car data...');
        const carsFilePath = path.join(process.cwd(), 'lib/data/cars.ts');
        const fileContent = fs.readFileSync(carsFilePath, 'utf-8');

        // Dirty hack to parse the array from TS file without compiling:
        // 1. Remove imports
        // 2. Remove type annotations
        // 3. Eval the array

        // Find the start of the array
        const startMatch = fileContent.match(/export const allCars: Car\[\] = \[\s*\{/);
        if (!startMatch) {
            throw new Error('Could not find allCars array start in cars.ts');
        }

        const startIndex = startMatch.index! + startMatch[0].length - 1; // pointing to [
        // We need to extract the array string. 
        // It's everything from `[` until the last `];`

        // This is risky.
        // Better approach: Create a temporary file that removes the type import and type annotation, 
        // and exports the array as CommonJS or just global, then require it.

        // Even better: User `allCars` is just a JSON object array in TS.
        // Let's just Regex to get the content between [ ... ];

        let jsonContent = fileContent.substring(fileContent.indexOf('['));
        jsonContent = jsonContent.substring(0, jsonContent.lastIndexOf(']') + 1);

        // Now we need to make it valid JSON. 
        // The keys are not quoted in TS? In the file view they looked quoted: "id": "audi-a4"
        // Let's check the file view again.
        // Yes, keys are quoted! "id": "audi-a4".
        // So it might just be valid JSON if we strip comments and type annotations if any.
        // It looks like standard JSON inside the array.

        const cars = eval(jsonContent); // Using eval to handle potential trailing commas or minor JS-isms

        console.log(`Found ${cars.length} cars to migrate.`);

        let successCount = 0;
        let failCount = 0;

        for (const car of cars) {
            console.log(`Migrating ${car.make} ${car.model}...`);

            const carPayload = {
                id: car.id,
                make: car.make,
                model: car.model,
                variant: car.variant || 'Standard',
                year: car.year,
                body_type: car.bodyType,
                segment: car.segment,
                price: car.price,
                price_min: car.pricing?.exShowroom?.min,
                price_max: car.pricing?.exShowroom?.max,
                currency: car.pricing?.exShowroom?.currency || 'INR',
                fuel_type: car.engine?.type,
                transmission_type: typeof car.transmission === 'string' ? car.transmission :
                    (car.transmission?.type || 'Unknown'),
                seating_capacity: car.dimensions?.seatingCapacity,
                fuel_efficiency: car.performance?.fuelEfficiency,

                // JSONB fields
                pricing: car.pricing,
                engine: car.engine,
                transmission: car.transmission,
                performance: car.performance,
                dimensions: car.dimensions,
                features: car.features,
                images: car.images,
                meta: car.meta,
                colors: car.colors
            };

            const { error } = await supabase
                .from('cars')
                .upsert(carPayload, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to migrate ${car.id}:`, error.message);
                failCount++;
            } else {
                successCount++;
            }
        }

        console.log(`Migration complete. Success: ${successCount}, Failed: ${failCount}`);

    } catch (error) {
        console.error('Migration script error:', error);
    }
}

migrateCars();
