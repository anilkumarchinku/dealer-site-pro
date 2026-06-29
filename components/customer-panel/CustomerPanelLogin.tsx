"use client"

import Link from "next/link"
import { ArrowLeft, Loader2, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Props {
    slug: string
    email: string
    setEmail: (v: string) => void
    phone: string
    setPhone: (v: string) => void
    code: string
    setCode: (v: string) => void
    stage: "request" | "verify"
    info: string
    error: string
    loading: boolean
    onSendCode: (e: React.FormEvent) => void
    onVerifyCode: (e: React.FormEvent) => void
    onReset: () => void
}

export function CustomerPanelLogin({
    slug, email, setEmail, phone, setPhone, code, setCode,
    stage, info, error, loading, onSendCode, onVerifyCode, onReset,
}: Props) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
            <Link
                href={`/sites/${slug}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to showroom
            </Link>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Panel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {stage === "request" ? (
                        <form onSubmit={onSendCode} className="space-y-4">
                            <p className="text-sm text-slate-500">
                                Verify your email to view your activity. We&apos;ll send a one-time code to confirm it&apos;s you.
                            </p>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Email</label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Phone <span className="font-normal text-slate-400">(optional)</span></label>
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
                                <p className="mt-1 text-xs text-slate-400">Also match records under this number.</p>
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" disabled={loading || !email.trim()} className="w-full gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                Send Verification Code
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={onVerifyCode} className="space-y-4">
                            {info && <p className="text-sm text-emerald-600">{info}</p>}
                            <div>
                                <label className="mb-2 block text-sm font-medium">6-digit code</label>
                                <Input
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="123456"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                />
                                <p className="mt-1 text-xs text-slate-400">Sent to {email}</p>
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" disabled={loading || code.length !== 6} className="w-full gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                                Verify &amp; View My Details
                            </Button>
                            <Button type="button" variant="ghost" onClick={onReset} className="w-full" disabled={loading}>
                                Use a different email
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
