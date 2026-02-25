"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !email.includes('@')) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: email.trim().toLowerCase(),
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setSent(true);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Failed to send magic link");
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
                {sent ? (
                    // Success: magic link sent
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Magic link sent to <strong>{email}</strong></span>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Check your email and click the link to sign in.
                                The link expires in 1 hour.
                            </p>

                            <button
                                type="button"
                                onClick={() => { setSent(false); setError(null); }}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Didn't receive it?{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Try again</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    // Email entry form
                    <form onSubmit={handleSendMagicLink} className="space-y-4">
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
                            <p className="text-xs text-muted-foreground">
                                We'll send a magic sign-in link to this email
                            </p>
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
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" /> Send magic link</>
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                Create one free
                            </Link>
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
