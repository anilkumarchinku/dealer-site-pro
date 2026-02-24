"use server";

/**
 * Server Actions for OTP-based authentication
 * Handles OTP verification and user authentication
 */

import { createClient } from "@supabase/supabase-js";
import { verifyOtp, incrementOtpAttempt } from "@/lib/services/otp-service";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

export async function verifyOtpAndLogin(
    email: string,
    code: string
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
    try {
        // Verify OTP code
        const { success, error } = await verifyOtp(email, code, "login");

        if (!success) {
            await incrementOtpAttempt(email, code, "login");
            return { success: false, error: error || "Invalid OTP code" };
        }

        // Check if user exists
        const { data: users, error: searchError } = await supabase.auth.admin?.listUsers() || { data: null, error: null };

        const user = users?.users?.find(u => u.email === email);

        if (!user) {
            return { success: false, error: "User not found. Please register first." };
        }

        // Get the user's dealer info
        const { data: dealer, error: dealerError } = await supabase
            .from("dealers")
            .select("id, onboarding_complete")
            .eq("user_id", user.id)
            .single();

        if (dealerError || !dealer) {
            return { success: false, error: "Could not fetch dealer information" };
        }

        // Create a session by generating a JWT token
        const { data: { session }, error: sessionError } = await supabase.auth.admin?.createSession?.({
            user_id: user.id,
        }) || { data: { session: null }, error: new Error("Session creation failed") };

        if (sessionError || !session) {
            return { success: false, error: "Could not create session" };
        }

        // Set the session (this happens on client side after redirect)
        return {
            success: true,
            redirectTo: dealer.onboarding_complete ? "/dashboard" : "/onboarding",
        };

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[Auth OTP] Login failed:", msg);
        return { success: false, error: msg };
    }
}

export async function verifyOtpAndRegister(
    email: string,
    code: string,
    userDetails: {
        fullName: string;
        mobileNumber: string;
        dealershipName: string;
    }
): Promise<{ success: boolean; error?: string; redirectTo?: string; dealerId?: string }> {
    try {
        // Verify OTP code
        const { success, error } = await verifyOtp(email, code, "register");

        if (!success) {
            await incrementOtpAttempt(email, code, "register");
            return { success: false, error: error || "Invalid OTP code" };
        }

        // Check if user already exists
        const { data: users } = await supabase.auth.admin?.listUsers() || { data: null };
        const existingUser = users?.users?.find(u => u.email === email);

        if (existingUser) {
            return { success: false, error: "This email is already registered. Please login instead." };
        }

        // Create new user with a temporary password
        const tempPassword = Math.random().toString(36).slice(-16) + "!Aa1";

        const { data: { user }, error: createError } = await supabase.auth.admin?.createUser({
            email,
            password: tempPassword,
            email_confirm: true, // Auto-confirm email since OTP was verified
            user_metadata: {
                full_name: userDetails.fullName,
                phone: userDetails.mobileNumber,
                dealership_name: userDetails.dealershipName,
            },
        }) || { data: { user: null }, error: new Error("User creation failed") };

        if (createError || !user) {
            return { success: false, error: createError?.message || "Registration failed" };
        }

        // Create session for the new user
        const { data: { session }, error: sessionError } = await supabase.auth.admin?.createSession({
            user_id: user.id,
        }) || { data: { session: null }, error: new Error("Session creation failed") };

        if (sessionError || !session) {
            return { success: false, error: "Could not create session" };
        }

        return {
            success: true,
            redirectTo: "/onboarding",
        };

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[Auth OTP] Register failed:", msg);
        return { success: false, error: msg };
    }
}
