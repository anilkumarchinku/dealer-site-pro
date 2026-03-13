import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient, requireAuth, requireDealerOwnership } from "@/lib/supabase-server";

export async function POST(req: Request) {
    try {
        const { user, supabase: authClient, errorResponse } = await requireAuth();
        if (errorResponse) return errorResponse;

        const { dealerId, template, brands } = await req.json();

        if (!dealerId || !template || !brands) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { errorResponse: ownerErr } = await requireDealerOwnership(authClient, user.id, dealerId);
        if (ownerErr) return ownerErr;

        // Use admin client after ownership is verified
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
            return NextResponse.json({ error: error.message }, { status: 500 });
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
