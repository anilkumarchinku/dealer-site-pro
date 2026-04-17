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

        const VALID_TEMPLATES = ['modern', 'luxury', 'sporty', 'family']
        if (!VALID_TEMPLATES.includes(template)) {
            return NextResponse.json({ error: "Invalid template value" }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data: updatedDealer, error } = await supabase
            .from("dealers")
            .update({
                style_template: template,
                brands: brands
            })
            .eq("id", dealerId)
            .select("slug")
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to save template settings" }, { status: 500 });
        }

        // Trigger ISR revalidation so the public dealer site reflects the new
        // template/brand immediately rather than waiting up to 5 minutes.
        if (updatedDealer?.slug) {
            revalidatePath(`/sites/${updatedDealer.slug}`)
        }

        return NextResponse.json({ success: true, message: "Template & Brand saved successfully!" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
