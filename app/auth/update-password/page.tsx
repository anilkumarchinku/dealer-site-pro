"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, Lock } from "lucide-react"

import BrandLogo from "@/components/BrandLogo"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { supabase } from "@/lib/supabase"
import { REGISTRATION_PASSWORD_MIN_LENGTH } from "@/lib/services/registration-availability-service"

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setSuccess(false)

        if (password.length < REGISTRATION_PASSWORD_MIN_LENGTH) {
            setError(`Password must be at least ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`)
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password })
            if (updateError) {
                setError(updateError.message)
                return
            }
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F7F3EA] px-4 py-10 text-[#0B0F12]">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#E3D9C8] bg-[#FFFBF3] shadow-[0_28px_100px_rgba(11,15,18,0.14)] lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-[#0B0F12] p-8 text-[#FFF8EC] sm:p-10">
                    <BrandLogo className="[&>span]:text-[#FFF8EC] [&_.brand-logo-accent]:text-[#C79A5B]" />
                    <div className="mt-16 max-w-md">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#D6A953]">
                            Secure reset
                        </p>
                        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                            Create a new password.
                        </h1>
                        <p className="mt-5 text-base leading-7 text-[#BDB6AA]">
                            Keep it strong and memorable. After saving, sign in again with your new password.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <Card className="border-[#E6DDCF] bg-white/80 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-3xl font-black tracking-tight">Update password</CardTitle>
                            <CardDescription>Enter your new DealerSite Pro password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">New password</Label>
                                    <PasswordInput
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                        autoComplete="new-password"
                                        disabled={loading || success}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirm password</Label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                        autoComplete="new-password"
                                        disabled={loading || success}
                                    />
                                </div>

                                {error && <Alert variant="error">{error}</Alert>}
                                {success && (
                                    <Alert variant="success">
                                        <CheckCircle2 className="mr-2 inline h-4 w-4" />
                                        Password updated. You can sign in now.
                                    </Alert>
                                )}

                                <Button type="submit" className="h-12 w-full rounded-xl bg-[#0B0F12] text-base font-black text-[#FFF8EC] hover:bg-[#201A13]" disabled={loading || success}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…</> : <><Lock className="mr-2 h-4 w-4" /> Update password</>}
                                </Button>

                                {success && (
                                    <Link href="/auth/login" className="block text-center text-sm font-bold text-[#A77C32] hover:text-[#0B0F12]">
                                        Go to login
                                    </Link>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
