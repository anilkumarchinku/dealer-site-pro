"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !email.includes('@')) {
            setError("Please enter a valid email");
            return;
        }
        if (!password) {
            setError("Please enter your password");
            return;
        }

        setLoading(true);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                if (authError.message.includes("Email not confirmed")) {
                    setError("Please verify your email first. Check your inbox for the verification link.");
                } else if (authError.message.includes("Invalid login credentials")) {
                    setError("Invalid email or password. Please try again.");
                } else {
                    setError(authError.message);
                }
                return;
            }

            // Redirect to dashboard
            window.location.href = "/dashboard";
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your dealership dashboard</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Registration success banner */}
                    {justRegistered && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Email verified! You can now sign in.</span>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="rajesh@rammotors.in"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</>
                        ) : (
                            <><LogIn className="w-4 h-4 mr-2" /> Sign In</>
                        )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Create one free
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
