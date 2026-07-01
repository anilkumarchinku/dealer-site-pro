import Link from "next/link";
import {
    ArrowRight,
    Bike,
    Building2,
    Car,
    CheckCircle2,
    FileSpreadsheet,
    Globe2,
    LayoutDashboard,
    LayoutTemplate,
    ListChecks,
    Palette,
    Rocket,
    Store,
    Truck,
    UploadCloud,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type FlowNode = {
    title: string;
    eyebrow: string;
    description: string;
    icon: LucideIcon;
    tone: "blue" | "amber" | "green" | "slate";
    details: string[];
};

type SetupNode = {
    title: string;
    icon: LucideIcon;
};

const flowNodes: FlowNode[] = [
    {
        eyebrow: "Step 1",
        title: "Business Mode",
        description: "Dealer selects New Vehicles, Used / Pre-Owned, or both for hybrid.",
        icon: Store,
        tone: "blue",
        details: ["New", "Used", "Hybrid = New + Used"],
    },
    {
        eyebrow: "Step 2",
        title: "Vehicle Categories",
        description: "Dealer selects one vehicle category for each website setup: Cars / 4W, Two-Wheelers, or Three-Wheelers.",
        icon: Car,
        tone: "green",
        details: ["2W", "3W", "4W", "One category per setup"],
    },
    {
        eyebrow: "Step 3",
        title: "Brand Mapping",
        description: "For every new-vehicle website, dealer picks one authorised OEM brand.",
        icon: Building2,
        tone: "amber",
        details: ["Cars brand", "2W brand", "3W brand", "Used skips brand"],
    },
    {
        eyebrow: "Step 4",
        title: "My Webpages Queue",
        description: "Dashboard shows one pending setup card for each generated website.",
        icon: LayoutDashboard,
        tone: "slate",
        details: ["Start per website", "Published sites remain visible", "Add more later"],
    },
];

const setupNodes: SetupNode[] = [
    { title: "Dealer profile", icon: Building2 },
    { title: "Website identity", icon: Palette },
    { title: "Inventory source", icon: UploadCloud },
    { title: "Services", icon: ListChecks },
    { title: "Template", icon: LayoutTemplate },
    { title: "Content & offers", icon: Globe2 },
    { title: "Review checklist", icon: CheckCircle2 },
    { title: "Publish", icon: Rocket },
];

const examples = [
    {
        title: "New cars dealer",
        formula: "New x Cars",
        result: "1 website",
        sites: ["New Cars"],
    },
    {
        title: "Used bike and auto dealer",
        formula: "Used x 2W + 3W",
        result: "2 websites",
        sites: ["Pre-Owned Two-Wheelers", "Pre-Owned Three-Wheelers"],
    },
    {
        title: "Amazing hybrid dealer",
        formula: "New + Used x 2W + 3W + 4W",
        result: "6 websites",
        sites: ["New Cars", "Pre-Owned Cars", "New Two-Wheelers", "Pre-Owned Two-Wheelers", "New Three-Wheelers", "Pre-Owned Three-Wheelers"],
    },
];

const toneClass = {
    blue:  "border-[#CFE0FF] bg-[#EEF4FF] text-[#155EEF]",
    amber: "border-[#F6D8A8] bg-[#FFF7EA] text-[#A85B00]",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function DealerFlowMapPage() {
    return (
        <main className="min-h-screen bg-[#F7F5EF] text-[#071436]">
            <header className="border-b border-[#E7E0D7] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">DealerSite Pro</p>
                        <h1 className="mt-1 text-2xl font-black tracking-[-0.03em]">Total Onboarding Flow</h1>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link href="/dealer-flow-demo" className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D8E0EA] bg-white px-4 text-sm font-black text-[#071436] transition hover:border-[#155EEF] hover:text-[#155EEF]">
                            Open Demo
                        </Link>
                        <Link href="/onboarding" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#155EEF] px-4 text-sm font-black text-white transition hover:bg-[#0F4FD3]">
                            Real Onboarding
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8">
                <section className="rounded-lg border border-[#E7E0D7] bg-white p-5 shadow-[0_18px_55px_rgba(7,20,54,0.06)]">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Entry Flow</p>
                            <h2 className="mt-2 text-4xl font-black leading-tight tracking-[-0.045em]">
                                Select once, generate every needed website.
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#62708A]">
                                The dealer first chooses stock mode, then vehicle categories. New websites ask for authorised brand mapping, used websites wait for inventory.
                            </p>
                        </div>
                        <div className="rounded-lg border border-[#D8E0EA] bg-[#071436] p-4 text-white">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Main formula</p>
                            <p className="mt-3 text-2xl font-black">Stock modes x Vehicle categories</p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
                                <div className="rounded-lg bg-white/10 px-2 py-3">New</div>
                                <div className="rounded-lg bg-white/10 px-2 py-3">Used</div>
                                <div className="rounded-lg bg-white/10 px-2 py-3">Hybrid</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 lg:grid-cols-4">
                    {flowNodes.map((node, index) => (
                        <article key={node.title} className="relative rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                            <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg border", toneClass[node.tone])}>
                                <node.icon className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#155EEF]">{node.eyebrow}</p>
                            <h3 className="mt-1 text-xl font-black tracking-[-0.02em]">{node.title}</h3>
                            <p className="mt-2 text-sm font-semibold leading-6 text-[#62708A]">{node.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {node.details.map((detail) => (
                                    <span key={detail} className="rounded-full border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-1 text-xs font-black text-[#35445C]">
                                        {detail}
                                    </span>
                                ))}
                            </div>
                            {index < flowNodes.length - 1 && (
                                <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-[#A39E94] lg:block" />
                            )}
                        </article>
                    ))}
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Per Website Setup</p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Every queue card opens this setup chain.</h2>
                            </div>
                            <Rocket className="h-8 w-8 text-[#155EEF]" />
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {setupNodes.map((step, index) => (
                                <div key={step.title} className="flex items-center gap-3 rounded-lg border border-[#E3E9F2] bg-[#F7F9FC] px-4 py-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#155EEF]">
                                        <step.icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#62708A]">Step {index + 1}</p>
                                        <p className="text-sm font-black">{step.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Vehicle Signals</p>
                        <div className="mt-4 grid gap-3">
                            {[
                                { label: "Cars / 4W", icon: Car },
                                { label: "Two-Wheelers", icon: Bike },
                                { label: "Three-Wheelers", icon: Truck },
                                { label: "Inventory upload or Cyepro", icon: FileSpreadsheet },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-[#E3E9F2] bg-[#F7F9FC] px-4 py-3 text-sm font-black">
                                    <item.icon className="h-4 w-4 text-[#155EEF]" />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </aside>
                </section>

                <section className="mt-6 rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Examples</p>
                    <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        {examples.map((example) => (
                            <article key={example.title} className="rounded-lg border border-[#E3E9F2] bg-[#F7F9FC] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-black tracking-[-0.02em]">{example.title}</h3>
                                        <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#62708A]">{example.formula}</p>
                                    </div>
                                    <span className="rounded-full bg-[#071436] px-3 py-1 text-xs font-black text-white">{example.result}</span>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {example.sites.map((site) => (
                                        <div key={site} className="rounded-lg border border-[#D8E0EA] bg-white px-3 py-2 text-sm font-black text-[#35445C]">
                                            {site}
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
