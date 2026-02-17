"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginUser } from "@/lib/db/auth";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

export default function LoginPage() {
    const router = useRouter();
    const { setDealerId } = useOnboardingStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password) {
            setError("Please enter your email and password");
            return;
        }

        setLoading(true);
        try {
            const result = await loginUser(email.trim().toLowerCase(), password);

            if (!result.success) {
                setError(result.error ?? "Invalid email or password");
                return;
            }

            if (result.dealerId) setDealerId(result.dealerId);

            // Redirect based on onboarding status
            if (result.onboardingComplete) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding/step-1");
            }
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={loading}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
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
                            "Sign In"
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
