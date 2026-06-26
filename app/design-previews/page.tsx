"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowRight,
    BarChart3,
    Bike,
    CalendarCheck,
    Car,
    Check,
    ChevronRight,
    Clock3,
    Gauge,
    Globe2,
    LayoutTemplate,
    Menu,
    MessageSquare,
    MonitorSmartphone,
    MousePointerClick,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Store,
    TrendingUp,
    Users,
    Wand2,
} from "lucide-react";

type DesignId = "editorial" | "command" | "velocity" | "local" | "showroom";

type DesignOption = {
    id: DesignId;
    name: string;
    tone: string;
    bestFor: string;
    palette: string;
    image: string;
};

const designs: DesignOption[] = [
    {
        id: "editorial",
        name: "Editorial Clean",
        tone: "White, confident, Apple-like",
        bestFor: "Main SaaS home page",
        palette: "White / Ink / Emerald",
        image: "/design-previews/clean-hero-vehicles.png",
    },
    {
        id: "command",
        name: "Command Center",
        tone: "Dark, precise, premium ops",
        bestFor: "Dealers who want power and trust",
        palette: "Graphite / Cyan / Amber",
        image: "/assets/hero/hyundai.png",
    },
    {
        id: "velocity",
        name: "Launch Velocity",
        tone: "Fast, bright, high-converting",
        bestFor: "Aggressive lead-generation",
        palette: "White / Signal Red / Indigo",
        image: "/assets/hero/tata-motors.jpg",
    },
    {
        id: "local",
        name: "Trusted Local",
        tone: "Warm, human, dealer-friendly",
        bestFor: "Small and mid-size city dealers",
        palette: "Mist / Forest / Blue",
        image: "/assets/hero/maruti-suzuki.jpg",
    },
    {
        id: "showroom",
        name: "Showroom Luxury",
        tone: "Minimal, luxury, quiet prestige",
        bestFor: "Premium car and EV dealerships",
        palette: "Black / Pearl / Gold",
        image: "/assets/hero/mercedes-benz.jpg",
    },
];

const proof = [
    { value: "10 min", label: "average launch" },
    { value: "5 steps", label: "guided setup" },
    { value: "Cars + Bikes + Autos", label: "catalog ready" },
];

const steps = [
    { title: "Answer setup questions", icon: MousePointerClick },
    { title: "Choose brands and inventory", icon: Car },
    { title: "Pick a premium template", icon: LayoutTemplate },
    { title: "Capture leads instantly", icon: MessageSquare },
];

export default function DesignPreviewsPage() {
    const [selectedId, setSelectedId] = useState<DesignId>("editorial");
    const selected = useMemo(
        () => designs.find((design) => design.id === selectedId) ?? designs[0],
        [selectedId]
    );

    return (
        <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
            <section className="border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Landing page concepts
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Pick the Dealer Site Pro direction
                            </h1>
                            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                                Five polished homepage directions inspired by your premium UI guide:
                                clear hero, proof, product signal, motion-ready sections, and full scrollable page flow.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Back to current home
                        </Link>
                    </div>

                    <div className="grid gap-3 md:grid-cols-5">
                        {designs.map((design) => {
                            const isSelected = design.id === selectedId;
                            return (
                                <button
                                    key={design.id}
                                    type="button"
                                    onClick={() => setSelectedId(design.id)}
                                    className={`rounded-lg border p-4 text-left transition ${
                                        isSelected
                                            ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                                            : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-sm font-bold">{design.name}</h2>
                                            <p className={`mt-1 text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                                {design.tone}
                                            </p>
                                        </div>
                                        {isSelected ? <Check className="h-4 w-4" /> : null}
                                    </div>
                                    <p className={`mt-4 text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                        {design.bestFor}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Selected preview</p>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">{selected.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Scroll inside the selected direction to feel the full homepage.
                        </p>
                    </div>
                    <p className="text-sm text-slate-500">{selected.palette}</p>
                </div>

                <PreviewFrame option={selected} />
            </section>
        </main>
    );
}

function PreviewFrame({ option }: { option: DesignOption }) {
    if (option.id === "command") return <CommandCenter option={option} />;
    if (option.id === "velocity") return <LaunchVelocity option={option} />;
    if (option.id === "local") return <TrustedLocal option={option} />;
    if (option.id === "showroom") return <ShowroomLuxury option={option} />;
    return <EditorialClean option={option} />;
}

function PreviewNav({ dark = false, accent = "bg-slate-950 text-white" }: { dark?: boolean; accent?: string }) {
    return (
        <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}>
                    <Store className="h-5 w-5" />
                </div>
                <span className="text-base font-bold tracking-tight">Dealer Site Pro</span>
            </div>
            <div className="hidden items-center gap-7 text-sm font-medium opacity-80 md:flex">
                <span>Templates</span>
                <span>Inventory</span>
                <span>Leads</span>
                <span>Pricing</span>
            </div>
            <button className={`hidden h-10 items-center rounded-md px-4 text-sm font-semibold md:inline-flex ${accent}`}>
                Start free
            </button>
            <Menu className="h-6 w-6 md:hidden" />
        </nav>
    );
}

function EditorialClean({ option, framed = true }: { option: DesignOption; framed?: boolean }) {
    return (
        <article
            className={`overflow-hidden bg-white text-[#07090a] ${
                framed ? "rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/80" : ""
            }`}
        >
            <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
                <nav className="flex items-center justify-between gap-4">
                    <div className="text-xl font-black tracking-tight">Dealer Site Pro</div>
                    <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
                        <span>Templates</span>
                        <span>Features</span>
                        <span>Pricing</span>
                        <span>Resources</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden h-11 items-center rounded-md bg-black px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:bg-slate-800 sm:inline-flex">
                            Start free
                        </button>
                        <button className="hidden text-sm font-bold text-slate-700 transition hover:text-black sm:inline-flex">
                            View templates
                        </button>
                        <Menu className="h-6 w-6 md:hidden" />
                    </div>
                </nav>

                <section className="pt-20 sm:pt-24">
                    <div className="mx-auto max-w-4xl">
                        <h3 className="font-serif text-[3.55rem] font-semibold leading-[0.98] tracking-tight text-black sm:text-[5.25rem] lg:text-[6.25rem]">
                            Launch your
                            <br />
                            dealership website
                            <br />
                            in 10 minutes
                        </h3>
                        <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-700">
                            Professional websites for car, bike, and auto dealers.
                            <br className="hidden sm:block" />
                            Beautiful templates. Easy editor. Go live in minutes.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <button className="inline-flex h-14 items-center justify-center rounded-md bg-black px-8 text-base font-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:bg-slate-800">
                                Start free
                            </button>
                            <button className="inline-flex h-14 items-center justify-center rounded-md border border-slate-300 bg-white px-8 text-base font-black text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
                                View templates
                            </button>
                        </div>
                    </div>
                    <div className="mx-auto mt-16 max-w-5xl">
                        <Image
                            src={option.image}
                            alt="Cars, bike, and auto lineup for Dealer Site Pro"
                            width={1016}
                            height={530}
                            className="h-auto w-full object-contain"
                            priority
                        />
                    </div>
                </section>
            </div>

            <section className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-6xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Store, title: "Built for Dealers", body: "Made for cars, bikes and autos" },
                        { icon: Clock3, title: "10-Minute Setup", body: "Get your site live in minutes" },
                        { icon: MonitorSmartphone, title: "Mobile-First", body: "Looks perfect on every device" },
                        { icon: Search, title: "SEO Ready", body: "Rank higher and get more leads" },
                    ].map(({ icon: Icon, title, body }) => (
                        <div key={title} className="flex flex-col items-center">
                            <Icon className="h-8 w-8 stroke-[1.65] text-black" />
                            <h4 className="mt-5 text-base font-black text-black">{title}</h4>
                            <p className="mt-2 max-w-[12rem] text-sm leading-6 text-slate-600">{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#fbfbfa] px-5 py-20 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1fr] lg:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-600">
                            Templates that sell
                        </p>
                        <h3 className="mt-8 font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-black sm:text-6xl">
                            Choose a template.
                            <br />
                            Make it yours.
                        </h3>
                        <p className="mt-8 max-w-sm text-lg leading-8 text-slate-600">
                            Modern, conversion-focused templates built for the Indian market.
                        </p>
                        <button className="mt-10 inline-flex items-center text-base font-black text-black transition hover:gap-2">
                            View all templates <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <Image
                            src="/design-previews/clean-template-preview.png"
                            alt="Dealer website template preview"
                            width={506}
                            height={684}
                            className="w-full max-w-[31rem] rounded-xl border border-slate-200 shadow-[0_22px_70px_rgba(15,23,42,0.12)]"
                        />
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-white px-5 py-18 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                    <div>
                        <h3 className="font-serif text-5xl font-semibold leading-tight tracking-tight text-black sm:text-6xl">
                            Everything a buyer needs before they call.
                        </h3>
                        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                            Show inventory, offers, service, finance, exchange, and test-drive actions
                            with the same quiet, premium layout.
                        </p>
                    </div>
                    <div className="grid gap-3">
                        {["Inventory pages", "Lead forms", "Service booking", "Finance enquiries"].map((item) => (
                            <div key={item} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 text-sm font-black shadow-sm">
                                <span>{item}</span>
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </article>
    );
}

function CommandCenter({ option }: { option: DesignOption }) {
    return (
        <article className="overflow-hidden rounded-xl border border-slate-800 bg-[#081114] text-white shadow-2xl shadow-slate-400/30">
            <div className="px-5 py-5 sm:px-8 lg:px-10">
                <PreviewNav dark accent="bg-cyan-300 text-slate-950" />
            </div>
            <section className="grid min-h-[650px] gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-16">
                <div className="flex flex-col justify-center">
                    <h3 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                        The control room for every dealer lead.
                    </h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                        Launch the website, route enquiries, watch demand, and keep your
                        showroom moving from one crisp command center.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <button className="inline-flex h-12 items-center justify-center rounded-md bg-cyan-300 px-6 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-6 text-sm font-bold text-white transition hover:bg-white/10">
                            View templates
                        </button>
                    </div>
                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                        {[
                            ["98%", "lead visibility"],
                            ["24/7", "site availability"],
                            ["Live", "inventory sync"],
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                <p className="text-2xl font-black text-cyan-200">{value}</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative flex min-h-[520px] items-end overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                    <Image src={option.image} alt="" fill className="object-cover opacity-55" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081114] via-[#081114]/40 to-transparent" />
                    <div className="relative w-full p-5">
                        <div className="rounded-lg border border-white/15 bg-[#0d1b20]/90 p-5 shadow-2xl backdrop-blur">
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-sm font-bold">Today&apos;s lead pulse</p>
                                <BarChart3 className="h-5 w-5 text-cyan-200" />
                            </div>
                            <div className="space-y-3">
                                {["Test drive requests", "Finance callbacks", "Exchange enquiries"].map((label, index) => (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs text-slate-300">
                                            <span>{label}</span>
                                            <span>{78 - index * 16}%</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-white/10">
                                            <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${78 - index * 16}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FeatureBand variant="dark" />
            <FullLandingSections variant="dark" />
        </article>
    );
}

function LaunchVelocity({ option }: { option: DesignOption }) {
    return (
        <article className="overflow-hidden rounded-xl border border-red-100 bg-white text-slate-950 shadow-2xl shadow-red-100/80">
            <div className="px-5 py-5 sm:px-8 lg:px-10">
                <PreviewNav accent="bg-red-600 text-white" />
            </div>
            <section className="grid min-h-[650px] gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10 lg:pb-16">
                <div className="flex flex-col justify-center">
                    <h3 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
                        Go live today. Start collecting leads tonight.
                    </h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                        A fast, conversion-first dealership page with templates, booking
                        flows, WhatsApp-ready enquiries, and offer sections already wired.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <button className="inline-flex h-12 items-center justify-center rounded-md bg-red-600 px-6 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700">
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800">
                            View templates
                        </button>
                    </div>
                    <div className="mt-10 flex flex-wrap gap-3">
                        {["Lead forms", "Test drives", "Offers", "Service bookings"].map((item) => (
                            <span key={item} className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#14151f]">
                    <Image src={option.image} alt="" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-red-700/55" />
                    <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-2">
                        {[
                            ["01", "Pick brand"],
                            ["02", "Select template"],
                            ["03", "Publish site"],
                            ["04", "Receive leads"],
                        ].map(([num, text]) => (
                            <div key={text} className="rounded-lg bg-white p-4 shadow-xl">
                                <p className="text-xs font-black text-red-600">{num}</p>
                                <p className="mt-1 text-sm font-black text-slate-950">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <FeatureBand variant="light" />
            <FullLandingSections variant="velocity" />
        </article>
    );
}

function TrustedLocal({ option }: { option: DesignOption }) {
    return (
        <article className="overflow-hidden rounded-xl border border-emerald-100 bg-[#f6fbfb] text-slate-950 shadow-2xl shadow-emerald-100/70">
            <div className="px-5 py-5 sm:px-8 lg:px-10">
                <PreviewNav accent="bg-[#166b57] text-white" />
            </div>
            <section className="grid min-h-[650px] gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-16">
                <div className="flex flex-col justify-center">
                    <h3 className="max-w-2xl text-5xl font-black leading-[1] tracking-tight text-[#123d36] sm:text-6xl lg:text-7xl">
                        A website that feels like your showroom.
                    </h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                        Make local buyers feel confident before they call. Show brands,
                        offers, service, reviews, and real ways to contact your team.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <button className="inline-flex h-12 items-center justify-center rounded-md bg-[#166b57] px-6 text-sm font-black text-white shadow-lg shadow-emerald-800/20 transition hover:bg-[#105242]">
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className="inline-flex h-12 items-center justify-center rounded-md border border-[#b7d9d2] bg-white px-6 text-sm font-bold text-[#123d36] transition hover:bg-white/80">
                            View templates
                        </button>
                    </div>
                    <div className="mt-10 space-y-3">
                        {[
                            "Customer-friendly enquiry and test drive flows",
                            "Service, exchange, finance and offers on one page",
                            "Simple setup for city dealers and growing teams",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm font-semibold text-[#123d36]">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#dff3ed] text-[#166b57]">
                                    <Check className="h-4 w-4" />
                                </span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-white shadow-xl shadow-emerald-900/10">
                    <Image src={option.image} alt="" fill className="object-cover" priority />
                    <div className="absolute inset-x-5 bottom-5 rounded-lg bg-white p-5 shadow-2xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black text-[#123d36]">Your local digital showroom</p>
                                <p className="mt-1 text-xs text-slate-500">Built for trust before the first call</p>
                            </div>
                            <div className="flex -space-x-2">
                                {[Users, Star, ShieldCheck].map((Icon, index) => (
                                    <span key={index} className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-white bg-[#dff3ed] text-[#166b57]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FeatureBand variant="mint" />
            <FullLandingSections variant="mint" />
        </article>
    );
}

function ShowroomLuxury({ option }: { option: DesignOption }) {
    return (
        <article className="overflow-hidden rounded-xl border border-black bg-[#050505] text-white shadow-2xl shadow-slate-500/40">
            <div className="px-5 py-5 sm:px-8 lg:px-10">
                <PreviewNav dark accent="bg-[#d7c28a] text-black" />
            </div>
            <section className="grid min-h-[650px] gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:pb-16">
                <div className="flex flex-col justify-center">
                    <h3 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                        Premium dealer websites without the agency wait.
                    </h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">
                        A refined landing experience for premium showrooms, EV brands,
                        and dealers who want the first impression to feel expensive.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <button className="inline-flex h-12 items-center justify-center rounded-md bg-[#d7c28a] px-6 text-sm font-black text-black transition hover:bg-[#ead79e]">
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-6 text-sm font-bold text-white transition hover:bg-white/10">
                            View templates
                        </button>
                    </div>
                    <div className="mt-12 flex items-center gap-5 border-t border-white/10 pt-7">
                        <Sparkles className="h-6 w-6 text-[#d7c28a]" />
                        <p className="max-w-sm text-sm leading-6 text-zinc-300">
                            Minimal sections, larger photography, and quieter interface details.
                        </p>
                    </div>
                </div>
                <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                    <Image src={option.image} alt="" fill className="object-cover opacity-85" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 rounded-lg border border-white/15 bg-black/70 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black">Luxury template system</p>
                            <p className="mt-1 text-xs text-zinc-400">Designed for premium catalogues and enquiries</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-[#d7c28a]" />
                    </div>
                </div>
            </section>
            <FeatureBand variant="black" />
            <FullLandingSections variant="black" />
        </article>
    );
}

type FullVariant = "light" | "dark" | "velocity" | "mint" | "black";

const templateCards = [
    { name: "Modern", fit: "Clean SaaS-style dealer homepage", image: "/assets/templates/modern.png" },
    { name: "Luxury", fit: "Premium showroom and EV catalogue", image: "/assets/templates/luxury.png" },
    { name: "Sporty", fit: "Fast-moving offers and launches", image: "/assets/templates/sporty.png" },
];

const testimonials = [
    {
        quote: "The website felt ready on day one. We started getting enquiries without explaining anything to customers.",
        name: "Rajesh Kumar",
        role: "Dealer principal",
    },
    {
        quote: "The lead forms, offers, and service sections made the site feel like a real digital showroom.",
        name: "Priya Sharma",
        role: "Sales manager",
    },
    {
        quote: "It gave us a professional look without waiting weeks for a custom agency build.",
        name: "Mohammed Ali",
        role: "Auto group director",
    },
];

function fullTheme(variant: FullVariant) {
    if (variant === "dark") {
        return {
            wrap: "border-white/10 bg-[#081114] text-white",
            soft: "bg-white/[0.04] border-white/10",
            text: "text-slate-300",
            muted: "text-slate-400",
            accent: "text-cyan-200",
            button: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
            outline: "border-white/20 text-white hover:bg-white/10",
            icon: "bg-cyan-300 text-slate-950",
        };
    }
    if (variant === "velocity") {
        return {
            wrap: "border-red-100 bg-white text-slate-950",
            soft: "bg-red-50 border-red-100",
            text: "text-slate-600",
            muted: "text-slate-500",
            accent: "text-red-600",
            button: "bg-red-600 text-white hover:bg-red-700",
            outline: "border-slate-300 text-slate-950 hover:bg-slate-50",
            icon: "bg-red-600 text-white",
        };
    }
    if (variant === "mint") {
        return {
            wrap: "border-[#d5ebe5] bg-[#f6fbfb] text-[#123d36]",
            soft: "bg-white border-[#d5ebe5]",
            text: "text-slate-600",
            muted: "text-slate-500",
            accent: "text-[#166b57]",
            button: "bg-[#166b57] text-white hover:bg-[#105242]",
            outline: "border-[#b7d9d2] text-[#123d36] hover:bg-white",
            icon: "bg-[#166b57] text-white",
        };
    }
    if (variant === "black") {
        return {
            wrap: "border-white/10 bg-[#050505] text-white",
            soft: "bg-white/[0.045] border-white/10",
            text: "text-zinc-300",
            muted: "text-zinc-400",
            accent: "text-[#d7c28a]",
            button: "bg-[#d7c28a] text-black hover:bg-[#ead79e]",
            outline: "border-white/20 text-white hover:bg-white/10",
            icon: "bg-[#d7c28a] text-black",
        };
    }
    return {
        wrap: "border-slate-200 bg-white text-slate-950",
        soft: "bg-slate-50 border-slate-200",
        text: "text-slate-600",
        muted: "text-slate-500",
        accent: "text-emerald-600",
        button: "bg-emerald-600 text-white hover:bg-emerald-700",
        outline: "border-slate-300 text-slate-950 hover:bg-slate-50",
        icon: "bg-slate-950 text-white",
    };
}

function FullLandingSections({ variant }: { variant: FullVariant }) {
    const theme = fullTheme(variant);
    const isDark = variant === "dark" || variant === "black";

    return (
        <div className={`border-t ${theme.wrap}`}>
            <section className="px-5 py-10 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className={`max-w-xl text-sm font-semibold uppercase tracking-[0.2em] ${theme.muted}`}>
                        Built for dealers selling cars, bikes, autos, EVs, service, finance, and exchange.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-sm font-black sm:grid-cols-6">
                        {["Tata", "Hyundai", "Maruti", "Mahindra", "Honda", "VinFast"].map((brand) => (
                            <span key={brand} className={`rounded-md border px-3 py-2 text-center ${theme.soft}`}>
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-8 border-t px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
                <div>
                    <p className={`text-sm font-black uppercase tracking-[0.18em] ${theme.accent}`}>The problem</p>
                    <h3 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        Most dealership sites look outdated before the first lead arrives.
                    </h3>
                    <p className={`mt-5 max-w-xl text-base leading-7 ${theme.text}`}>
                        Dealers need trust, speed, inventory clarity, mobile-first enquiries, and a page
                        that feels real enough for buyers to call today.
                    </p>
                </div>
                <div className={`grid gap-4 rounded-lg border p-5 ${theme.soft}`}>
                    {[
                        { icon: Globe2, title: "Website live fast", body: "Publish a complete site after guided setup, not a blank theme." },
                        { icon: Car, title: "Inventory is the story", body: "Show vehicle types, models, offers, specs, galleries, and pricing paths." },
                        { icon: CalendarCheck, title: "Every section captures demand", body: "Test drives, callbacks, service, finance, exchange, and WhatsApp-ready enquiries." },
                    ].map(({ icon: Icon, title, body }) => (
                        <div key={title} className="grid gap-4 border-b border-current/10 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[44px_1fr]">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-md ${theme.icon}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black">{title}</h4>
                                <p className={`mt-1 text-sm leading-6 ${theme.text}`}>{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t px-5 py-14 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className={`text-sm font-black uppercase tracking-[0.18em] ${theme.accent}`}>Template system</p>
                        <h3 className="mt-3 text-4xl font-black tracking-tight">Choose the showroom mood.</h3>
                    </div>
                    <p className={`max-w-md text-sm leading-6 ${theme.text}`}>
                        Each template keeps the same lead engine, but changes the visual tone for the dealership.
                    </p>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {templateCards.map((template) => (
                        <div key={template.name} className={`overflow-hidden rounded-lg border ${theme.soft}`}>
                            <div className="relative aspect-[16/10] bg-slate-200">
                                <Image src={template.image} alt={`${template.name} template preview`} fill className="object-cover" />
                            </div>
                            <div className="p-5">
                                <h4 className="text-xl font-black">{template.name}</h4>
                                <p className={`mt-2 text-sm leading-6 ${theme.text}`}>{template.fit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-8 border-t px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                <div className={`rounded-lg border p-5 ${theme.soft}`}>
                    <div className="flex items-center justify-between gap-4 border-b border-current/10 pb-4">
                        <div>
                            <p className={`text-xs font-black uppercase tracking-[0.18em] ${theme.muted}`}>Lead dashboard</p>
                            <h3 className="mt-1 text-2xl font-black">Today at your showroom</h3>
                        </div>
                        <TrendingUp className={`h-6 w-6 ${theme.accent}`} />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {[
                            ["18", "new leads"],
                            ["7", "test drives"],
                            ["4", "finance calls"],
                        ].map(([value, label]) => (
                            <div key={label} className={`rounded-md border p-4 ${isDark ? "border-white/10 bg-black/20" : "border-current/10 bg-white/70"}`}>
                                <p className="text-3xl font-black">{value}</p>
                                <p className={`mt-1 text-xs font-bold uppercase tracking-[0.16em] ${theme.muted}`}>{label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 space-y-3">
                        {["VinFast VF 7 test drive", "Activa service enquiry", "Used SUV exchange request"].map((lead, index) => (
                            <div key={lead} className={`flex items-center justify-between rounded-md border p-4 ${isDark ? "border-white/10 bg-black/20" : "border-current/10 bg-white/80"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${theme.icon}`}>
                                        {index === 0 ? <Car className="h-4 w-4" /> : index === 1 ? <Bike className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black">{lead}</p>
                                        <p className={`text-xs ${theme.muted}`}>Assigned to sales team</p>
                                    </div>
                                </div>
                                <Clock3 className={`h-4 w-4 ${theme.muted}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <p className={`text-sm font-black uppercase tracking-[0.18em] ${theme.accent}`}>Conversion flow</p>
                    <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        Not just pretty. Built to move buyers to action.
                    </h3>
                    <p className={`mt-5 text-base leading-7 ${theme.text}`}>
                        The homepage guides buyers from brand trust to vehicles, then to a clear action:
                        enquire, book a test drive, request finance, ask about exchange, or schedule service.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button className={`inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-black transition ${theme.button}`}>
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className={`inline-flex h-12 items-center justify-center rounded-md border px-6 text-sm font-black transition ${theme.outline}`}>
                            View templates
                        </button>
                    </div>
                </div>
            </section>

            <section className="border-t px-5 py-14 sm:px-8 lg:px-10">
                <div className="grid gap-5 md:grid-cols-3">
                    {testimonials.map((item) => (
                        <figure key={item.name} className={`rounded-lg border p-6 ${theme.soft}`}>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((star) => (
                                    <Star key={star} className={`h-4 w-4 fill-current ${theme.accent}`} />
                                ))}
                            </div>
                            <blockquote className={`mt-5 text-base font-semibold leading-7 ${theme.text}`}>
                                &quot;{item.quote}&quot;
                            </blockquote>
                            <figcaption className="mt-6">
                                <p className="font-black">{item.name}</p>
                                <p className={`text-sm ${theme.muted}`}>{item.role}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="border-t px-5 py-14 sm:px-8 lg:px-10">
                <div className={`rounded-lg border p-8 text-center ${theme.soft}`}>
                    <h3 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        Ready to turn this direction into the real homepage?
                    </h3>
                    <p className={`mx-auto mt-5 max-w-2xl text-base leading-7 ${theme.text}`}>
                        Pick the style you like, and I can convert it into the actual Dealer Site Pro landing page.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <button className={`inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-black transition ${theme.button}`}>
                            Start free <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button className={`inline-flex h-12 items-center justify-center rounded-md border px-6 text-sm font-black transition ${theme.outline}`}>
                            Compare designs
                        </button>
                    </div>
                </div>
            </section>

            <footer className={`flex flex-col gap-4 border-t px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 ${theme.muted}`}>
                <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${theme.icon}`}>
                        <Store className="h-4 w-4" />
                    </div>
                    <span className="font-black">Dealer Site Pro</span>
                </div>
                <div className="flex flex-wrap gap-5">
                    <span>Templates</span>
                    <span>Inventory</span>
                    <span>Leads</span>
                    <span>Support</span>
                </div>
            </footer>
        </div>
    );
}

function FeatureBand({ variant }: { variant: "light" | "dark" | "mint" | "black" }) {
    const isDark = variant === "dark" || variant === "black";
    const bandClass =
        variant === "dark"
            ? "border-white/10 bg-white/[0.04] text-white"
            : variant === "black"
                ? "border-white/10 bg-[#0d0d0d] text-white"
                : variant === "mint"
                    ? "border-[#d5ebe5] bg-white text-[#123d36]"
                    : "border-slate-200 bg-slate-50 text-slate-950";

    return (
        <section className={`border-t px-5 py-8 sm:px-8 lg:px-10 ${bandClass}`}>
            <div className="grid gap-4 md:grid-cols-4">
                {steps.map(({ title, icon: Icon }, index) => (
                    <div key={title} className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${isDark ? "bg-white/10 text-white" : "bg-slate-950 text-white"}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className={`text-xs font-black ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                                0{index + 1}
                            </p>
                            <p className="mt-1 text-sm font-black">{title}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`mt-8 grid gap-4 border-t pt-8 md:grid-cols-3 ${isDark ? "border-white/10" : "border-slate-200"}`}>
                {[
                    { icon: Wand2, title: "Premium templates", body: "Modern, luxury, sporty, and family-ready dealer designs." },
                    { icon: Gauge, title: "Vehicle-ready pages", body: "Cars, bikes, autos, pricing, specs, galleries, and offers." },
                    { icon: TrendingUp, title: "Lead capture", body: "Test drive, enquiry, service, exchange, finance, and callbacks." },
                ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex gap-4">
                        <Icon className={`mt-1 h-5 w-5 shrink-0 ${isDark ? "text-cyan-200" : "text-emerald-600"}`} />
                        <div>
                            <h4 className="text-base font-black">{title}</h4>
                            <p className={`mt-2 text-sm leading-6 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
