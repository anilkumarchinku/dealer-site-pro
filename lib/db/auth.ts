"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export interface RegisterInput {
    fullName: string;
    mobileNumber: string;
    dealershipName: string;
    email: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    dealerId?: string;
    onboardingComplete?: boolean;
    needsEmailConfirmation?: boolean;
    error?: string;
}

export interface DealerProfile {
    id: string;
    dealership_name: string;
    phone: string;
    email: string;
    location: string;
    onboarding_complete: boolean;
    onboarding_step: number;
}

// ── Register new user — dealer row is created by DB trigger ──
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    // 1. Create Supabase auth user, passing dealer data in user_metadata
    //    so the `on_auth_user_created` SECURITY DEFINER trigger can pick it up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
            data: {
                full_name:       input.fullName,
                phone:           input.mobileNumber,
                dealership_name: input.dealershipName,
            },
        },
    });

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: "Registration failed. Please try again." };

    // 2. If no session, Supabase requires email confirmation first
    if (!authData.session) {
        return { success: true, needsEmailConfirmation: true };
    }

    // 3. Session exists — fetch the dealer row created by the trigger
    const { data: dealer } = await supabase
        .from("dealers")
        .select("id")
        .eq("user_id", authData.user.id)
        .single();

    return { success: true, dealerId: dealer?.id, onboardingComplete: false };
}

// ── Login existing user ───────────────────────────────────────
export async function loginUser(
    email: string,
    password: string
): Promise<AuthResult> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: "Login failed. Please try again." };

    // Fetch the dealer row for this user
    const { data: dealer, error: dealerError } = await supabase
        .from("dealers")
        .select("id, onboarding_complete, onboarding_step, dealership_name, phone, location")
        .eq("user_id", data.user.id)
        .single();

    if (dealerError || !dealer) {
        // Auth succeeded but no dealer row — shouldn't happen, but handle gracefully
        return { success: true, dealerId: undefined, onboardingComplete: false };
    }

    return {
        success: true,
        dealerId: dealer.id,
        onboardingComplete: dealer.onboarding_complete,
    };
}

// ── Get current logged-in dealer ──────────────────────────────
export async function getCurrentDealer(): Promise<DealerProfile | null> {
    if (!isSupabaseReady()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: dealer, error } = await supabase
        .from("dealers")
        .select("id, dealership_name, phone, email, location, onboarding_complete, onboarding_step")
        .eq("user_id", user.id)
        .single();

    if (error || !dealer) return null;
    return dealer as DealerProfile;
}

// ── Sign out ──────────────────────────────────────────────────
export async function signOut(): Promise<void> {
    if (!isSupabaseReady()) return;
    await supabase.auth.signOut();
}
