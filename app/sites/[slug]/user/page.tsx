"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { CustomerPanelLogin } from "@/components/customer-panel/CustomerPanelLogin"
import { CustomerPanelTopBar } from "@/components/customer-panel/CustomerPanelTopBar"
import { CustomerPanelSidebar } from "@/components/customer-panel/CustomerPanelSidebar"
import { CustomerPanelDashboard } from "@/components/customer-panel/CustomerPanelDashboard"
import { CustomerPanelInquiries } from "@/components/customer-panel/CustomerPanelInquiries"
import { CustomerPanelTestDrives } from "@/components/customer-panel/CustomerPanelTestDrives"
import { CustomerPanelSellRequests } from "@/components/customer-panel/CustomerPanelSellRequests"
import { CustomerPanelServiceBookings } from "@/components/customer-panel/CustomerPanelServiceBookings"
import { CustomerPanelDealerInfo } from "@/components/customer-panel/CustomerPanelDealerInfo"
import type { PanelData, SectionId } from "@/components/customer-panel/types"

export default function CustomerPanelPage() {
    const params = useParams()
    const slug = params.slug as string

    // OTP login flow
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [stage, setStage] = useState<"request" | "verify">("request")
    const [info, setInfo] = useState("")
    const [data, setData] = useState<PanelData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Navigation state
    const [activeSection, setActiveSection] = useState<SectionId>("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const sendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setInfo("")
        setData(null)
        try {
            const res = await fetch("/api/customer-panel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "send-otp", slug, email }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? "Could not send verification code")
            setStage("verify")
            setInfo(json.message ?? "We sent a 6-digit code to your email.")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not send verification code")
        } finally {
            setLoading(false)
        }
    }

    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/customer-panel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "verify", slug, email, code, phone }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? "Could not verify code")
            setData(json)
            setInfo("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not verify code")
        } finally {
            setLoading(false)
        }
    }

    const resetFlow = () => {
        setStage("request")
        setCode("")
        setError("")
        setInfo("")
        setData(null)
        setActiveSection("dashboard")
    }

    // Pre-login: full-screen centered login card
    if (!data) {
        return (
            <CustomerPanelLogin
                slug={slug}
                email={email} setEmail={setEmail}
                phone={phone} setPhone={setPhone}
                code={code} setCode={setCode}
                stage={stage}
                info={info} error={error} loading={loading}
                onSendCode={sendCode}
                onVerifyCode={verifyCode}
                onReset={resetFlow}
            />
        )
    }

    // Post-login: app shell with sidebar + content
    const counts: Partial<Record<SectionId, number>> = {
        inquiries: data.history.inquiries.length,
        "test-drives": data.history.test_drives.length,
        "sell-requests": data.history.sell_requests.length,
        "service-bookings": data.history.service_bookings.length,
    }

    const handleSectionChange = (id: SectionId) => {
        setActiveSection(id)
        setSidebarOpen(false)
    }

    function renderSection(panelData: PanelData) {
        switch (activeSection) {
            case "dashboard":
                return <CustomerPanelDashboard data={panelData} slug={slug} onSectionChange={handleSectionChange} />
            case "inquiries":
                return <CustomerPanelInquiries inquiries={panelData.history.inquiries} />
            case "test-drives":
                return <CustomerPanelTestDrives testDrives={panelData.history.test_drives} />
            case "sell-requests":
                return <CustomerPanelSellRequests sellRequests={panelData.history.sell_requests} />
            case "service-bookings":
                return <CustomerPanelServiceBookings serviceBookings={panelData.history.service_bookings} />
            case "dealer-info":
                return <CustomerPanelDealerInfo dealer={panelData.dealer} />
            default:
                return <CustomerPanelDashboard data={panelData} slug={slug} onSectionChange={handleSectionChange} />
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-slate-200 lg:flex">
                <CustomerPanelSidebar activeSection={activeSection} onSectionChange={handleSectionChange} counts={counts} />
            </aside>

            {/* Mobile sidebar drawer */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <CustomerPanelSidebar activeSection={activeSection} onSectionChange={handleSectionChange} counts={counts} />
                </SheetContent>
            </Sheet>

            {/* Main content area */}
            <div className="lg:pl-60">
                <CustomerPanelTopBar
                    slug={slug}
                    email={email}
                    dealerName={data.dealer.dealership_name}
                    onLogout={resetFlow}
                    onMenuToggle={() => setSidebarOpen(true)}
                />
                <main className="p-4 sm:p-6">
                    {renderSection(data)}
                </main>
            </div>
        </div>
    )
}
