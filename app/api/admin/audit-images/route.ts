import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAuth } from "@/lib/supabase-server";

export async function GET(request: Request) {
    const { errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    try {
        const dataPath = path.join(process.cwd(), 'public/data/brand-models.json');
        const imagesBase = path.join(process.cwd(), 'public/data/brand-model-images');

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: "brand-models.json not found" }, { status: 404 });
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const BRAND_FOLDER_MAP_2W: Record<string, string> = {
            "royal enfield": "royal-enfield",
            "hero motocorp": "hero-motocorp",
            "honda motorcycle & scooter india": "honda-hmsi",
            "honda": "honda-hmsi",
            "tvs motor company": "tvs-motor",
            "tvs": "tvs-motor",
            "bajaj auto": "bajaj-auto",
            "bajaj": "bajaj-auto",
            "yamaha india": "yamaha-india",
            "yamaha": "yamaha-india",
            "suzuki motorcycle india": "suzuki-motorcycle",
            "suzuki": "suzuki-motorcycle",
            "ktm india": "ktm-india",
            "ktm": "ktm-india",
            "kawasaki india": "kawasaki-india",
            "kawasaki": "kawasaki-india",
            "ather energy": "ather-energy",
            "ather": "ather-energy",
            "ola electric": "ola-electric"
        };

        const BRAND_FOLDER_MAP_3W: Record<string, string> = {
            "mahindra": "mahindra-3w",
            "bajaj": "bajaj-auto-3w",
            "bajaj auto": "bajaj-auto-3w",
            "tvs": "tvs-king",
            "tvs motor company": "tvs-king",
            "piaggio": "piaggio-ape",
            "greaves": "greaves-electric-3w",
            "greaves electric": "greaves-electric-3w",
            "kinetic": "kinetic-green",
            "kinetic green": "kinetic-green",
            "euler": "euler-motors",
            "euler motors": "euler-motors",
            "atul": "atul-auto",
            "atul auto": "atul-auto",
            "lohia": "lohia-auto",
            "lohia auto": "lohia-auto"
        };

        function brandNameToId(brandName: string, category = "2w") {
            const lower = brandName.toLowerCase().trim();
            const map = category === "3w" ? BRAND_FOLDER_MAP_3W : BRAND_FOLDER_MAP_2W;
            if (map[lower]) return map[lower];
            return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        }

        function modelToSlug(model: string) {
            return model.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        }

        let total = 0;
        let missing = 0;
        const auditList: any[] = [];

        function checkModel(vehicleType: string, brandId: string, model: string, originalBrand: string) {
            total++;
            const slug = modelToSlug(model);
            const jpgPath = path.join(imagesBase, vehicleType, brandId, `${slug}.jpg`);
            const pngPath = path.join(imagesBase, vehicleType, brandId, `${slug}.png`);

            const hasJpg = fs.existsSync(jpgPath);
            const hasPng = fs.existsSync(pngPath);
            const isMissing = !hasJpg && !hasPng;

            if (isMissing) missing++;

            const url = isMissing ? null : `/data/brand-model-images/${vehicleType}/${brandId}/${slug}.${hasJpg ? 'jpg' : 'png'}`;

            auditList.push({
                type: vehicleType,
                brandId,
                originalBrand,
                model,
                slug,
                isMissing,
                imageUrl: url
            });
        }

        // 2W
        for (const [, brands] of Object.entries(data.twoWheelers) as any) {
            for (const brandGroup of brands) {
                const rawBrandId = brandGroup.brandId || brandGroup.brand;
                const brandId = brandNameToId(rawBrandId || brandGroup.brand, "2w");
                const originalBrand = brandGroup.brand;
                const modelsObj = brandGroup.models;
                if (Array.isArray(modelsObj)) {
                    modelsObj.forEach((model: string) => checkModel("2w", brandId, model, originalBrand));
                } else {
                    for (const [, models] of Object.entries(modelsObj) as any) {
                        if (Array.isArray(models)) {
                            models.forEach((model: string) => checkModel("2w", brandId, model, originalBrand));
                        }
                    }
                }
            }
        }

        // 3W
        data.threeWheelers.forEach((brandGroup: any) => {
            const rawBrandId = brandGroup.brandId || brandGroup.brand;
            const brandId = brandNameToId(rawBrandId || brandGroup.brand, "3w");
            const originalBrand = brandGroup.brand;
            const modelsObj = brandGroup.models;
            if (Array.isArray(modelsObj)) {
                modelsObj.forEach((model: string) => checkModel("3w", brandId, model, originalBrand));
            } else {
                for (const [, models] of Object.entries(modelsObj) as any) {
                    if (Array.isArray(models)) {
                        models.forEach((model: string) => checkModel("3w", brandId, model, originalBrand));
                    }
                }
            }
        });

        return NextResponse.json({
            stats: { total, missing, present: total - missing },
            models: auditList
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
