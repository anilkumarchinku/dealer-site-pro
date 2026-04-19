import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import { requireAdminSession } from "@/lib/utils/admin-session";

export async function POST(req: Request) {
    try {
        const { errorResponse } = await requireAdminSession();
        if (errorResponse) return errorResponse;

        const { dealerId, template, brands } = await req.json();

        if (!dealerId || !template || !brands) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!Array.isArray(brands) || brands.length === 0 || brands.some((brand) => typeof brand !== "string" || !brand.trim())) {
            return NextResponse.json({ error: "Brands must be a non-empty list of strings" }, { status: 400 });
        }

        const VALID_TEMPLATES = ['modern', 'luxury', 'sporty', 'family']
        if (!VALID_TEMPLATES.includes(template)) {
            return NextResponse.json({ error: "Invalid template value" }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data: updatedDealer, error } = await supabase
            .from("dealers")
            .select("id, slug, vehicle_type")
            .eq("id", dealerId)
            .single();

        if (error || !updatedDealer) {
            return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
        }

        const { error: updateError } = await supabase
            .from("dealers")
            .update({
                style_template: template,
            })
            .eq("id", dealerId);

        if (updateError) {
            return NextResponse.json({ error: "Failed to save template settings" }, { status: 500 });
        }

        const brandVehicleType = updatedDealer.vehicle_type === 'two-wheeler'
            ? '2w'
            : updatedDealer.vehicle_type === 'three-wheeler'
                ? '3w'
                : 'cars';

        const normalizedBrands = brands.map((brand: string, index: number) => ({
            dealer_id: dealerId,
            brand_name: brand.trim(),
            is_primary: index === 0,
            vehicle_type: brandVehicleType,
        }));

        const { error: deleteBrandsError } = await supabase
            .from("dealer_brands")
            .delete()
            .eq("dealer_id", dealerId);

        if (deleteBrandsError) {
            return NextResponse.json({ error: "Failed to clear existing dealer brands" }, { status: 500 });
        }

        const { error: insertBrandsError } = await supabase
            .from("dealer_brands")
            .insert(normalizedBrands);

        if (insertBrandsError) {
            return NextResponse.json({ error: "Failed to save dealer brands" }, { status: 500 });
        }

        // Trigger ISR revalidation so the public dealer site reflects the new
        // template/brand immediately rather than waiting up to 5 minutes.
        if (updatedDealer.slug) {
            revalidatePath(`/sites/${updatedDealer.slug}`)
        }

        return NextResponse.json({
            success: true,
            slug: updatedDealer.slug ?? null,
            message: "Template & Brand saved successfully!"
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
