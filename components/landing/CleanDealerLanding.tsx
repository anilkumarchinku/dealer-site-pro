import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Bike,
    CalendarCheck,
    Car,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Globe2,
    Menu,
    MessageSquare,
    MonitorSmartphone,
    Search,
    ShieldCheck,
    Sparkles,
    Store,
    TrendingUp,
    Users,
    Wrench,
} from "lucide-react";

const proofItems = [
    { icon: Store, title: "Built for Dealers", body: "Cars, bikes and autos presented in one premium showroom." },
    { icon: Clock3, title: "10-Minute Setup", body: "Start with a polished template and launch without a long agency cycle." },
    { icon: MonitorSmartphone, title: "Mobile-First", body: "Every section is designed for buyers browsing on phones." },
    { icon: Search, title: "SEO Ready", body: "Clean pages, clear actions and local search signals built in." },
];

const vehicleTypes = [
    {
        name: "Car Dealers",
        body: "Model pages, offers, image galleries and test-drive actions feel premium from the first click.",
        image: "/design-previews/clean-thumb-car.png",
        icon: Car,
    },
    {
        name: "Bike Dealers",
        body: "Two-wheeler buyers get fast discovery, enquiry prompts and mobile-ready booking paths.",
        image: "/design-previews/clean-thumb-bike.png",
        icon: Bike,
    },
    {
        name: "Auto Dealers",
        body: "Three-wheeler inventory, finance enquiries and local demand pages feel trustworthy.",
        image: "/design-previews/clean-thumb-auto.png",
        icon: Store,
    },
];

const setupSteps = [
    { title: "Choose the look", body: "Start with a dealer-ready template built for quick scanning.", icon: Sparkles },
    { title: "Load inventory", body: "Add vehicle categories, offers, photos and enquiry actions.", icon: Car },
    { title: "Collect enquiries", body: "Route test drives, finance calls and service leads from the page.", icon: MessageSquare },
    { title: "Publish live", body: "Go from draft to a polished dealership website in minutes.", icon: Globe2 },
];

const leadRows = [
    { title: "Test drive request", meta: "Silver SUV, today 4:30 PM", icon: CalendarCheck },
    { title: "Finance callback", meta: "Buyer asked for EMI options", icon: TrendingUp },
    { title: "Service enquiry", meta: "Two-wheeler service slot", icon: Wrench },
];

const trustItems = [
    ["Launch faster", "A focused page structure keeps setup simple and directs every visitor to a next step."],
    ["Look premium", "Editorial typography, restrained contrast and clean vehicle imagery make the site feel mature."],
    ["Sell locally", "Template sections are shaped around calls, enquiries, test drives and nearby buyers."],
];

export function CleanDealerLanding() {
    return (
        <article className="bg-white text-[#07090a]">
            <header className="sticky top-0 z-30 border-b border-black/10 bg-white/92 backdrop-blur-xl">
                <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Link href="/" className="text-xl font-black tracking-tight text-black">
                        Dealer Site Pro
                    </Link>
                    <div className="hidden items-center gap-9 text-[0.82rem] font-bold text-slate-700 md:flex">
                        <a href="#templates" className="transition hover:text-black">Templates</a>
                        <a href="#features" className="transition hover:text-black">Features</a>
                        <a href="#workflow" className="transition hover:text-black">Workflow</a>
                        <a href="#leads" className="transition hover:text-black">Leads</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="#start"
                            className="hidden h-10 items-center rounded-md bg-black px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex"
                        >
                            Start free
                        </a>
                        <a href="#templates" className="hidden text-sm font-bold text-slate-700 transition hover:text-black sm:inline-flex">
                            View templates
                        </a>
                        <Menu className="h-6 w-6 md:hidden" />
                    </div>
                </nav>
            </header>

            <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_58%,#f4f5f4_100%)] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-18 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div className="max-w-3xl">
                        <h1 className="font-serif text-[3.55rem] font-semibold leading-[0.94] tracking-tight text-black sm:text-[5.9rem] lg:text-[4.75rem] xl:text-[5.05rem]">
                            Launch your
                            <br />
                            dealership website
                            <br />
                            in 10 minutes
                        </h1>
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                            Professional websites for car, bike and auto dealers. Beautiful templates,
                            guided setup, lead capture, and a showroom-quality first impression.
                        </p>
                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <a
                                href="#start"
                                className="inline-flex h-14 items-center justify-center rounded-md bg-black px-8 text-base font-black text-white shadow-[0_18px_38px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                Start free <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a
                                href="#templates"
                                className="inline-flex h-14 items-center justify-center rounded-md border border-slate-300 bg-white px-8 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-50"
                            >
                                View templates
                            </a>
                        </div>
                    </div>

                    <div className="relative min-h-[23rem] lg:min-h-[34rem]">
                        <div className="absolute inset-x-0 bottom-8 h-28 rounded-[50%] bg-slate-300/70 blur-3xl" />
                        <img
                            src="/design-previews/clean-hero-vehicles-crisp.webp"
                            alt="Cars, bike and auto lineup for Dealer Site Pro"
                            width={2032}
                            height={1060}
                            loading="eager"
                            decoding="async"
                            className="relative z-10 mx-auto mt-4 h-auto w-full max-w-[42rem] object-contain drop-shadow-[0_28px_42px_rgba(15,23,42,0.18)] lg:mt-16"
                        />
                    </div>
                </div>
            </section>

            <section id="features" className="border-y border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {proofItems.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.055)] transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,23,42,0.09)]">
                            <Icon className="h-7 w-7 stroke-[1.75] text-black" />
                            <h2 className="mt-5 text-base font-black text-black">{title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="templates" className="px-5 py-20 sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Templates that sell</p>
                        <h2 className="mt-7 font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-black sm:text-6xl">
                            Choose a template.
                            <br />
                            Make it yours.
                        </h2>
                        <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                            Start with a conversion-focused showroom page, then tune the content,
                            inventory and lead paths for your dealership.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-xl">
                            {["Modern hero", "Vehicle cards", "Lead sections"].map((item) => (
                                <div key={item} className="flex min-h-14 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-black shadow-sm">
                                    <CheckCircle2 className="h-4 w-4 flex-none text-emerald-700" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        <a href="#start" className="mt-9 inline-flex items-center text-base font-black text-black transition hover:gap-2">
                            View all templates <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-lg bg-[linear-gradient(135deg,#ffffff,#eef2f1)] shadow-[0_28px_80px_rgba(15,23,42,0.1)]" />
                        <img
                            src="/design-previews/clean-template-preview-clarity.webp"
                            alt="Dealer website template preview"
                            width={1012}
                            height={1368}
                            loading="lazy"
                            decoding="async"
                            className="relative mx-auto h-auto w-full max-w-[28rem] rounded-lg border border-slate-200 bg-white shadow-[0_20px_54px_rgba(15,23,42,0.12)]"
                        />
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-[#f7f7f5] px-5 py-20 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 lg:grid-cols-[0.74fr_1fr] lg:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">One platform</p>
                            <h2 className="mt-7 font-serif text-5xl font-semibold leading-tight tracking-tight text-black sm:text-6xl">
                                Built for every vehicle your dealership sells.
                            </h2>
                        </div>
                        <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
                            Keep the clean editorial look while giving every vehicle type a clear
                            offer, enquiry path and buyer-friendly detail page.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {vehicleTypes.map(({ icon: Icon, ...vehicle }) => (
                            <div key={vehicle.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.065)] transition hover:-translate-y-1 hover:shadow-[0_26px_62px_rgba(15,23,42,0.1)]">
                                <div className="flex h-36 items-center justify-center rounded-lg bg-[#fbfbfa]">
                                    <Image
                                        src={vehicle.image}
                                        alt={`${vehicle.name} preview`}
                                        width={170}
                                        height={130}
                                        className="h-24 w-auto object-contain"
                                    />
                                </div>
                                <div className="mt-6 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="font-serif text-3xl font-semibold tracking-tight text-black">{vehicle.name}</h3>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-600">{vehicle.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="workflow" className="bg-white px-5 py-20 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Go live in 4 clear moves</p>
                        <h2 className="mt-5 font-serif text-5xl font-semibold leading-tight tracking-tight text-black sm:text-6xl">
                            From empty domain to polished online showroom.
                        </h2>
                    </div>
                    <div className="mt-12 grid gap-4 md:grid-cols-4">
                        {setupSteps.map(({ icon: Icon, title, body }, index) => (
                            <div key={title} className="relative rounded-lg border border-black/10 bg-[#fbfbfa] p-6 shadow-[0_18px_46px_rgba(15,23,42,0.045)]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-400">0{index + 1}</span>
                                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-white">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-black">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="leads" className="border-y border-slate-200 bg-[#0b1115] px-5 py-20 text-white sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Lead engine included</p>
                        <h2 className="mt-7 font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                            Make every page move the buyer forward.
                        </h2>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                            The clean design stays calm, but it still pushes visitors toward
                            enquiries, test drives, finance callbacks and service requests.
                        </p>
                        <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-3">
                            {[
                                ["10 min", "setup"],
                                ["3 types", "vehicles"],
                                ["24/7", "lead capture"],
                            ].map(([value, label]) => (
                                <div key={label} className="border-t border-white/15 pt-4">
                                    <p className="text-3xl font-black">{value}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Today at your showroom</p>
                                <h3 className="mt-2 text-2xl font-black">18 new buyer actions</h3>
                            </div>
                            <TrendingUp className="h-6 w-6 text-emerald-300" />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {[
                                ["18", "leads"],
                                ["7", "test drives"],
                                ["4", "finance calls"],
                            ].map(([value, label]) => (
                                <div key={label} className="rounded-md border border-white/10 bg-white/[0.055] p-4">
                                    <p className="text-3xl font-black">{value}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 space-y-3">
                            {leadRows.map(({ icon: Icon, title, meta }) => (
                                <div key={title} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.055] p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-white text-black">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-black">{title}</p>
                                            <p className="mt-1 text-xs text-slate-400">{meta}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-5 md:grid-cols-3">
                        {trustItems.map(([title, body]) => (
                            <figure key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.045)]">
                                <ShieldCheck className="h-6 w-6 text-emerald-700" />
                                <blockquote className="mt-5 text-lg font-black leading-7 text-black">{title}</blockquote>
                                <figcaption className="mt-3 text-sm leading-6 text-slate-600">{body}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            <section id="start" className="overflow-hidden bg-black px-5 py-20 text-white sm:px-8 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Dealer Site Pro</p>
                        <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                            A clean landing page with real selling power.
                        </h2>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                            Keep the elegant white-space direction, then layer in stronger sections,
                            better conversion cues and a polished showroom finish.
                        </p>
                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/onboarding"
                                className="inline-flex h-14 items-center justify-center rounded-md bg-white px-8 text-base font-black text-black shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-100"
                            >
                                Use this design <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/five-landing-previews"
                                className="inline-flex h-14 items-center justify-center rounded-md border border-white/20 px-8 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                            >
                                Compare all 5
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-x-8 bottom-6 h-24 rounded-[50%] bg-white/10 blur-3xl" />
                        <img
                            src="/design-previews/clean-hero-vehicles-crisp.webp"
                            alt="Vehicle lineup for cars, bikes and autos"
                            width={2032}
                            height={1060}
                            loading="lazy"
                            decoding="async"
                            className="relative h-auto w-full object-contain opacity-95"
                        />
                    </div>
                </div>
            </section>
        </article>
    );
}
