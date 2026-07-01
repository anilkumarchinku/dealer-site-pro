"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Mail, Phone } from "lucide-react"

import BrandLogo from "@/components/BrandLogo"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setMessage(null)

        if (!identifier.trim()) {
            setError("Enter your registered email or mobile number")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            })
            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                setError(payload.error ?? payload.message ?? "Could not send reset link")
                return
            }

            setMessage(payload.message ?? "Password reset link sent.")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not send reset link")
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
                            Password recovery
                        </p>
                        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                            Reset with email or mobile.
                        </h1>
                        <p className="mt-5 text-base leading-7 text-[#BDB6AA]">
                            Enter the email or phone number linked to your DealerSite Pro account. We will send the reset link to the registered email.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <Card className="border-[#E6DDCF] bg-white/80 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-3xl font-black tracking-tight">Forgot password?</CardTitle>
                            <CardDescription>Use your registered email or 10-digit mobile number.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="identifier">Email or mobile number</Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A77C32]" />
                                        <Phone className="pointer-events-none absolute left-9 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A77C32]" />
                                        <Input
                                            id="identifier"
                                            value={identifier}
                                            onChange={(event) => setIdentifier(event.target.value)}
                                            placeholder="rajesh@rammotors.in or 9876543210"
                                            autoComplete="username"
                                            disabled={loading}
                                            className="h-12 rounded-xl border-[#E6DDCF] pl-16"
                                        />
                                    </div>
                                </div>

                                {error && <Alert variant="error">{error}</Alert>}
                                {message && (
                                    <Alert variant="success">
                                        <CheckCircle2 className="mr-2 inline h-4 w-4" />
                                        {message}
                                    </Alert>
                                )}

                                <Button type="submit" className="h-12 w-full rounded-xl bg-[#0B0F12] text-base font-black text-[#FFF8EC] hover:bg-[#201A13]" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending reset link…</> : "Send reset link"}
                                </Button>

                                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#A77C32] hover:text-[#0B0F12]">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
