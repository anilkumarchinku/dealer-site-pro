"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Fuel,
  Gauge,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

type TemplateKey = "modern" | "luxury" | "sporty" | "family";

type Vehicle = {
  name: string;
  variant: string;
  image: string;
  price: string;
  fuel: string;
  highlight: string;
  body: string;
};

const vehicles: Record<TemplateKey, Vehicle[]> = {
  modern: [
    {
      name: "Hyundai Ioniq 5",
      variant: "Long Range RWD",
      image: "/assets/cars/hyundai/ioniq-5.jpg",
      price: "Rs 46.05L",
      fuel: "Electric",
      highlight: "631 km",
      body: "Crossover",
    },
    {
      name: "Kia EV9",
      variant: "GT-Line AWD",
      image: "/assets/cars/kia/ev9.jpg",
      price: "Rs 1.30Cr",
      fuel: "Electric",
      highlight: "6 seats",
      body: "SUV",
    },
    {
      name: "Mahindra BE 6",
      variant: "Pack Three",
      image: "/assets/cars/mahindra/be-6.jpg",
      price: "Rs 26.90L",
      fuel: "Electric",
      highlight: "79 kWh",
      body: "Coupe SUV",
    },
  ],
  luxury: [
    {
      name: "Mercedes-Maybach S-Class",
      variant: "S 680",
      image: "/assets/cars/mercedes-benz/maybach-s-class.jpg",
      price: "Rs 3.44Cr",
      fuel: "Petrol",
      highlight: "Executive",
      body: "Sedan",
    },
    {
      name: "BMW i7",
      variant: "xDrive60 M Sport",
      image: "/assets/cars/bmw/i7.jpg",
      price: "Rs 2.13Cr",
      fuel: "Electric",
      highlight: "Lounge seats",
      body: "Sedan",
    },
    {
      name: "Range Rover",
      variant: "Autobiography",
      image: "/assets/cars/land-rover/range-rover.jpg",
      price: "Rs 2.40Cr",
      fuel: "Petrol",
      highlight: "Bespoke",
      body: "SUV",
    },
  ],
  sporty: [
    {
      name: "Porsche 911",
      variant: "Carrera S",
      image: "/assets/cars/porsche/911.jpg",
      price: "Rs 2.01Cr",
      fuel: "Petrol",
      highlight: "3.7s",
      body: "Coupe",
    },
    {
      name: "BMW M4",
      variant: "Competition",
      image: "/assets/cars/bmw/m4.jpg",
      price: "Rs 1.53Cr",
      fuel: "Petrol",
      highlight: "530 hp",
      body: "Coupe",
    },
    {
      name: "Lamborghini Urus",
      variant: "S",
      image: "/assets/cars/lamborghini/urus.jpg",
      price: "Rs 4.18Cr",
      fuel: "Petrol",
      highlight: "650 hp",
      body: "Super SUV",
    },
  ],
  family: [
    {
      name: "Toyota Innova Hycross",
      variant: "ZX(O) Hybrid",
      image: "/assets/cars/toyota/innova-hycross.jpg",
      price: "Rs 31.34L",
      fuel: "Hybrid",
      highlight: "7 seats",
      body: "MPV",
    },
    {
      name: "Kia Carens Clavis",
      variant: "HTX Plus",
      image: "/assets/cars/kia/carens-clavis.jpg",
      price: "Rs 19.49L",
      fuel: "Petrol",
      highlight: "6 seats",
      body: "MPV",
    },
    {
      name: "Mahindra XUV700",
      variant: "AX7 L",
      image: "/assets/cars/mahindra/xuv700.jpg",
      price: "Rs 26.99L",
      fuel: "Diesel",
      highlight: "ADAS",
      body: "SUV",
    },
  ],
};

const tabs: Array<{ key: TemplateKey; label: string; note: string }> = [
  { key: "modern", label: "Modern", note: "digital showroom" },
  { key: "luxury", label: "Luxury", note: "concierge atelier" },
  { key: "sporty", label: "Sport", note: "performance garage" },
  { key: "family", label: "Family", note: "trust centre" },
];

const sectionChecklist = [
  "Hero",
  "New inventory",
  "Services",
  "EV zone",
  "Reviews",
  "Offers",
  "Exchange",
  "Trust",
  "Finance",
  "Service booking",
  "FAQ",
  "Video",
  "Contact",
  "Locations",
];

const festivalOffers = [
  {
    title: "Festive booking benefit",
    description: "Priority delivery support, accessory guidance, and showroom celebration for new-car bookings.",
    tag: "Festival",
    note: "Slot 1 of 5",
  },
  {
    title: "Exchange upgrade week",
    description: "Trade-in desk, valuation assistance, and upgrade planning for buyers moving into a new vehicle.",
    tag: "Exchange",
    note: "Slot 2 of 5",
  },
  {
    title: "Easy EMI consultation",
    description: "Finance desk support with down-payment planning, EMI preview, and loan-document guidance.",
    tag: "Finance",
    note: "Slot 3 of 5",
  },
  {
    title: "Delivery celebration pack",
    description: "Handover ceremony, accessory checklist, first-service reminder, and family delivery photo moment.",
    tag: "Delivery",
    note: "Slot 4 of 5",
  },
  {
    title: "EV starter support",
    description: "Charger, range, battery, and ownership guidance for buyers choosing a new electric vehicle.",
    tag: "EV",
    note: "Slot 5 of 5",
  },
];

export default function NextLevelTemplatesPage() {
  const [active, setActive] = useState<TemplateKey>("modern");

  return (
    <>
      <style jsx global>{`
        @keyframes next-template-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .next-template-marquee {
          animation: next-template-marquee 34s linear infinite;
        }

        .next-template-marquee:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .next-template-marquee {
            animation: none;
          }
        }
      `}</style>

      <main className="min-h-screen bg-[#0D1014] text-white">
        {active === "modern" && <ModernFirstHandTemplate />}
        {active === "luxury" && <LuxuryFirstHandTemplate />}
        {active === "sporty" && <SportyFirstHandTemplate />}
        {active === "family" && <FamilyFirstHandTemplate />}
        <FloatingTemplateControls active={active} onChange={setActive} />
      </main>
    </>
  );
}

function FloatingTemplateControls({
  active,
  onChange,
}: {
  active: TemplateKey;
  onChange: (key: TemplateKey) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 rounded-full border border-white/15 bg-[#0D1014]/88 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1" aria-label="Template selector">
        {tabs.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              data-testid={`template-tab-${tab.key}`}
              onClick={() => onChange(tab.key)}
              className={`rounded-full px-3 py-3 text-xs font-black transition sm:text-sm ${
                selected
                  ? "bg-white text-[#0D1014]"
                  : "text-white/72 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModernFirstHandTemplate() {
  const stock = vehicles.modern;

  return (
    <article data-testid="active-template-preview" className="bg-[#F5F8F6] text-[#101514]">
      <ModernNav />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:py-14">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDF4EF] px-4 py-2 text-sm font-black text-[#0B6E69]">
            <Sparkles className="h-4 w-4" />
            First-hand EV launch desk
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Find the right 2026 car without showroom confusion.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[#68736E] sm:text-lg">
            Live new-car inventory, verified on-road pricing, finance preview, service support, and dealer contact in one clean digital showroom.
          </p>

          <div className="mt-8 rounded-[28px] border border-[#D5E3DE] bg-white p-3 shadow-xl shadow-[#0B6E69]/10">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E2EAE5] px-4 py-3">
                <Search className="h-5 w-5 text-[#0B6E69]" />
                <span className="font-bold text-[#5D6862]">Search Ioniq 5, EV9, BE 6, hybrid SUV...</span>
              </div>
              <button className="rounded-2xl bg-[#0B6E69] px-6 py-3 font-black text-white">
                Search new stock
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {["Budget", "Body type", "Fuel", "Delivery ETA"].map((item) => (
                <button key={item} className="rounded-2xl bg-[#F1F6F3] px-4 py-3 text-sm font-black text-[#34413B]">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <HeroModelCard vehicle={stock[0]} accent="#0B6E69" priority />
          <div className="grid gap-4 sm:grid-cols-2">
            <MiniLaunchCard vehicle={stock[1]} accent="#0B6E69" />
            <MiniLaunchCard vehicle={stock[2]} accent="#0B6E69" />
          </div>
        </div>
      </section>

      <ModernSectionMap />
      <ModernInventory stock={stock} />
      <FestivalOfferRail tone="modern" accent="#0B6E69" />
      <ModernServices />
      <ModernEvReviews />
      <ModernOffersFinance />
      <ModernOperations />
    </article>
  );
}

function ModernNav() {
  return (
    <nav className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex items-center justify-between rounded-[26px] border border-[#DCE7E1] bg-white/90 px-4 py-3 shadow-lg shadow-black/5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#0B6E69] font-black text-white">
            M
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black">Metro Drive Studio</p>
            <p className="truncate text-xs font-bold text-[#68736E]">Hyderabad new car showroom</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm font-bold text-[#4F5B55] lg:flex">
          <span>New Cars</span>
          <span>EV Zone</span>
          <span>Finance</span>
          <span>Service</span>
          <span>Contact</span>
        </div>
        <button className="inline-flex items-center rounded-full bg-[#0B6E69] px-5 py-3 text-sm font-black text-white">
          Enquire
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

function ModernSectionMap() {
  return (
    <section className="border-y border-[#DDE8E2] bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
        {sectionChecklist.map((section) => (
          <span key={section} className="rounded-full bg-[#F1F6F3] px-4 py-2 text-xs font-black text-[#4D5A54]">
            {section}
          </span>
        ))}
      </div>
    </section>
  );
}

function ModernInventory({ stock }: { stock: Vehicle[] }) {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0B6E69]">New inventory</p>
            <h3 className="mt-2 text-3xl font-black sm:text-4xl">Live launch lane</h3>
          </div>
          <div className="flex gap-2">
            {["All", "EV", "SUV", "Ready stock"].map((item) => (
              <button key={item} className="rounded-full border border-[#D5E1DB] bg-white px-4 py-2 text-sm font-black">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {stock.map((vehicle, index) => (
            <NewVehicleCard key={vehicle.name} vehicle={vehicle} accent="#0B6E69" priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModernServices() {
  return (
    <section className="bg-[#EAF4EF] px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0B6E69]">Services</p>
          <h3 className="mt-2 text-3xl font-black">Everything a new-car buyer asks for.</h3>
          <p className="mt-4 font-semibold leading-7 text-[#637069]">
            Test drive, on-road price, finance, insurance, exchange, delivery planning, service booking, and accessories.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Test drive", CalendarDays],
            ["On-road price", BadgeCheck],
            ["Finance", Gauge],
            ["Exchange", HeartHandshake],
            ["Service booking", Wrench],
            ["Insurance", ShieldCheck],
          ].map(([label, Icon]) => (
            <IconTile key={String(label)} icon={<Icon className="h-5 w-5" />} label={String(label)} accent="#0B6E69" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModernEvReviews() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-[#101514] px-4 py-14 text-white sm:px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2))]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#76E5C8]">EV zone</p>
        <h3 className="mt-3 max-w-xl text-4xl font-black">Battery, range, charger and delivery confidence.</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric value="631 km" label="range preview" />
          <Metric value="80%" label="fast charge" />
          <Metric value="3" label="EV launches" />
        </div>
      </div>
      <div className="bg-white px-4 py-14 sm:px-6 lg:pr-[max(1.5rem,calc((100vw-80rem)/2))]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0B6E69]">Reviews</p>
        <h3 className="mt-3 text-3xl font-black">Buyer proof stays near the decision.</h3>
        <div className="mt-7 rounded-[28px] border border-[#E0E8E3] p-6 shadow-lg shadow-black/5">
          <div className="flex gap-1 text-[#D6A853]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-lg font-bold leading-8 text-[#3E4842]">
            Clear finance numbers, accurate delivery dates, and an easy test-drive process.
          </p>
          <p className="mt-4 text-sm font-black text-[#68736E]">Verified new-car buyer</p>
        </div>
      </div>
    </section>
  );
}

function ModernOffersFinance() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[34px] border border-[#DCE7E1] bg-white shadow-xl shadow-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <Image src="/assets/cars/kia/ev9.jpg" alt="EV launch offer" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="p-7">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0B6E69]">Offers</p>
              <h3 className="mt-3 text-3xl font-black">July EV launch benefits</h3>
              <p className="mt-4 font-semibold leading-7 text-[#68736E]">
                Charger support, insurance assistance, delivery ceremony, and selected accessories for 2026 EV bookings.
              </p>
              <button className="mt-6 rounded-full bg-[#0B6E69] px-6 py-3 font-black text-white">Claim offer</button>
            </div>
          </div>
        </div>
        <div className="rounded-[34px] border border-[#DCE7E1] bg-[#101514] p-7 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#76E5C8]">Finance</p>
          <h3 className="mt-3 text-3xl font-black">EMI estimate</h3>
          <div className="mt-7 space-y-4">
            <FinanceRow label="Vehicle price" value="Rs 46.05L" />
            <FinanceRow label="Down payment" value="Rs 9.20L" />
            <FinanceRow label="Estimated EMI" value="Rs 76,800/mo" strong />
          </div>
        </div>
      </div>
    </section>
  );
}

function ModernOperations() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-4">
        <OperationalCard title="Exchange" copy="Trade old vehicle and see upgrade value." icon={<HeartHandshake className="h-6 w-6" />} />
        <OperationalCard title="Trust" copy="Verified dealer, transparent pricing, real stock." icon={<ShieldCheck className="h-6 w-6" />} />
        <OperationalCard title="Service booking" copy="Schedule first service, accessories, and delivery." icon={<Wrench className="h-6 w-6" />} />
        <OperationalCard title="FAQ + video + locations" copy="Answer doubts, watch walkthrough, visit outlet." icon={<Play className="h-6 w-6" />} />
      </div>
      <ContactStrip theme="light" accent="#0B6E69" dealer="Metro Drive Studio" />
    </section>
  );
}

function LuxuryFirstHandTemplate() {
  const stock = vehicles.luxury;

  return (
    <article data-testid="active-template-preview" className="bg-[#0C0F0E] text-[#FFF7E8]">
      <section className="relative min-h-[760px] overflow-hidden">
        <Image
          src={stock[0].image}
          alt={stock[0].name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F0E] via-[#0C0F0E]/86 to-[#0C0F0E]/25" />
        <LuxuryNav />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:py-28">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#C9A56A]">Private new car atelier</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-none sm:text-7xl">
              A concierge showroom for premium first owners.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[#D8D0C3]">
              Flagship collections, appointment slots, finance concierge, exchange advisory, and delivery ceremony designed for luxury buyers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#C9A56A] px-7 py-4 font-black text-[#111111]">Reserve private viewing</button>
              <button className="rounded-full border border-[#615342] px-7 py-4 font-black text-[#FFF7E8]">Explore collection</button>
            </div>
          </div>
          <LuxuryAppointmentPanel stock={stock} />
        </div>
      </section>

      <LuxuryCollection stock={stock} />
      <FestivalOfferRail tone="luxury" accent="#C9A56A" dark />
      <LuxuryOwnership />
      <LuxuryOfferTrust />
      <LuxuryConciergeFlow />
    </article>
  );
}

function LuxuryNav() {
  return (
    <nav className="relative z-10 mx-auto max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex items-center justify-between border-b border-[#3A342E] pb-5">
        <div>
          <p className="text-xl font-black">Imperial Motors</p>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A99D8D]">Bengaluru flagship lounge</p>
        </div>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#D8D0C3] lg:flex">
          <span>Collection</span>
          <span>Concierge</span>
          <span>Finance</span>
          <span>Service</span>
        </div>
        <button className="rounded-full bg-[#FFF7E8] px-5 py-3 text-sm font-black text-[#0C0F0E]">Call host</button>
      </div>
    </nav>
  );
}

function LuxuryAppointmentPanel({ stock }: { stock: Vehicle[] }) {
  return (
    <aside className="rounded-[34px] border border-[#4B4134] bg-[#111614]/88 p-5 shadow-2xl shadow-black/35 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#C9A56A]">Today in lounge</p>
          <h3 className="mt-2 text-3xl font-black">{stock[0].name}</h3>
          <p className="mt-1 font-semibold text-[#BFB4A5]">{stock[0].variant}</p>
        </div>
        <div className="rounded-2xl bg-[#C9A56A] px-4 py-3 text-center text-[#111111]">
          <p className="text-xs font-black">from</p>
          <p className="text-lg font-black">{stock[0].price}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric value="12" label="private slots" />
        <Metric value="9" label="flagships" />
        <Metric value="24/7" label="concierge" />
      </div>
      <div className="mt-6 rounded-[26px] border border-[#3D342B] bg-[#0C0F0E] p-4">
        <p className="text-sm font-black text-[#C9A56A]">Appointment includes</p>
        <div className="mt-4 grid gap-3 text-sm font-semibold text-[#D8D0C3]">
          {["Host-led model viewing", "Finance and insurance desk", "Exchange valuation", "Service and delivery plan"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#C9A56A]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function LuxuryCollection({ stock }: { stock: Vehicle[] }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#C9A56A]">New inventory collection</p>
            <h3 className="mt-3 text-4xl font-black">Flagships first, filters second.</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {["Sedan", "SUV", "Electric", "Bespoke"].map((item) => (
              <button key={item} className="rounded-full border border-[#4A4034] px-4 py-3 text-sm font-black text-[#D8D0C3]">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <LuxuryFeatureCard vehicle={stock[1]} />
          <div className="grid gap-5">
            <LuxurySmallCard vehicle={stock[0]} priority />
            <LuxurySmallCard vehicle={stock[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LuxuryOwnership() {
  return (
    <section className="border-y border-[#302B23] bg-[#141817] px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#C9A56A]">Services + EV zone + reviews + finance</p>
          <h3 className="mt-3 text-4xl font-black">Ownership suite, not a generic form.</h3>
          <p className="mt-5 max-w-xl font-semibold leading-7 text-[#BFB4A5]">
            The current template sections become a premium ownership room: EMI estimate, EV guidance, buyer reviews, exchange advisory, service booking, FAQ, and contact.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Finance concierge", "EMI, insurance and payment timeline."],
            ["Exchange advisory", "Valuation with upgrade options."],
            ["Service promise", "Pickup, service bay, and warranty care."],
            ["Video walkthrough", "Cinematic model and feature overview."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[28px] border border-[#3D342B] bg-[#0C0F0E] p-6">
              <p className="text-xl font-black">{title}</p>
              <p className="mt-3 font-semibold leading-7 text-[#BFB4A5]">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuxuryOfferTrust() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-[#4A4034] bg-[#171B1A] p-7">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#C9A56A]">Offers</p>
          <h3 className="mt-3 text-3xl font-black">Executive delivery package</h3>
          <p className="mt-4 font-semibold leading-7 text-[#BFB4A5]">
            Ceramic protection, premium handover, first-year service pickup, and finance consultation.
          </p>
          <button className="mt-7 rounded-full bg-[#C9A56A] px-6 py-3 font-black text-[#111111]">Request details</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Trust", "Verified pricing and host-led handover."],
            ["Reviews", "Buyer proof presented as testimonials."],
            ["Locations", "Flagship lounge and service centre map."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[30px] border border-[#3D342B] bg-[#111614] p-5">
              <ShieldCheck className="h-7 w-7 text-[#C9A56A]" />
              <h4 className="mt-5 text-xl font-black">{title}</h4>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#BFB4A5]">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuxuryConciergeFlow() {
  return (
    <section className="bg-[#FFF7E8] px-4 py-16 text-[#111111] sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#8C6533]">FAQ + video + contact + locations</p>
          <h3 className="mt-3 text-4xl font-black">A buyer journey that ends with a booked appointment.</h3>
          <div className="mt-7 grid gap-3">
            {["Can I configure trims before the visit?", "Can finance be pre-approved?", "Can service pickup be arranged?"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-[#E3D5BF] bg-white px-5 py-4 font-black">
                {item}
                <ChevronDown className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
        <ContactStrip theme="light" accent="#8C6533" dealer="Imperial Motors" />
      </div>
    </section>
  );
}

function SportyFirstHandTemplate() {
  const stock = vehicles.sporty;

  return (
    <article data-testid="active-template-preview" className="bg-[#090C10] text-white">
      <SportNav />
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(230,64,46,0.28),transparent_34%),linear-gradient(135deg,#090C10_0%,#111925_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5B46]">Performance new vehicle template</p>
            <h1 className="mt-6 text-5xl font-black uppercase leading-none sm:text-7xl">
              Built for fast decisions.
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-[#AAB5C1]">
              Sport buyers need power, specs, availability, test-drive urgency, finance, and comparison in one high-energy flow.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Metric value="3.7s" label="hero spec" />
              <Metric value="31" label="test drives" />
              <Metric value="14" label="new launches" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rotate-2 rounded-[40px] border border-[#FF5B46]/40" />
            <HeroModelCard vehicle={stock[0]} accent="#E6402E" priority />
          </div>
        </div>
      </section>
      <SportInventory stock={stock} />
      <FestivalOfferRail tone="sport" accent="#E6402E" dark />
      <SportPitLane />
      <SportOfferFinance />
      <SportTrustVideoContact />
    </article>
  );
}

function SportNav() {
  return (
    <nav className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex items-center justify-between border-b border-[#27313B] pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center bg-[#E6402E] font-black">V</div>
          <div>
            <p className="text-lg font-black uppercase">Velocity Garage</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8D99A7]">Mumbai performance showroom</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm font-black uppercase text-[#B5C0CB] lg:flex">
          <span>Launches</span>
          <span>Specs</span>
          <span>Finance</span>
          <span>Service</span>
        </div>
        <button className="rounded-none bg-[#E6402E] px-5 py-3 text-sm font-black uppercase text-white">Book drive</button>
      </div>
    </nav>
  );
}

function SportInventory({ stock }: { stock: Vehicle[] }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5B46]">New inventory</p>
            <h3 className="text-4xl font-black uppercase">Performance grid</h3>
          </div>
          <button className="w-fit border border-[#E6402E] px-5 py-3 font-black uppercase text-[#FF5B46]">Compare specs</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {stock.map((vehicle, index) => (
            <div key={vehicle.name} className="group border border-[#27313B] bg-[#111821]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={vehicle.image} alt={vehicle.name} fill priority={index === 0} sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute left-4 top-4 bg-[#E6402E] px-3 py-2 text-xs font-black uppercase">{vehicle.highlight}</div>
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF5B46]">{vehicle.body}</p>
                <h4 className="mt-2 text-2xl font-black uppercase">{vehicle.name}</h4>
                <p className="mt-1 font-semibold text-[#AAB5C1]">{vehicle.variant}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <SpecBox label="Fuel" value={vehicle.fuel} />
                  <SpecBox label="Price" value={vehicle.price} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportPitLane() {
  return (
    <section className="border-y border-[#27313B] bg-[#111821] px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5B46]">Services + EV zone + reviews</p>
          <h3 className="text-4xl font-black uppercase">Pit lane buying flow</h3>
          <p className="mt-4 font-semibold leading-7 text-[#AAB5C1]">
            Test drive, on-road quote, EV zone, reviews, finance, exchange, service booking, and FAQ are staged like a performance checklist.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Test drive", CalendarDays],
            ["EMI", Gauge],
            ["Exchange", HeartHandshake],
            ["Trust", ShieldCheck],
            ["Service booking", Wrench],
            ["Reviews", Star],
            ["Video", Play],
          ].map(([label, Icon]) => (
            <div key={String(label)} className="border border-[#303B46] bg-[#0B1016] p-5">
              <Icon className="h-6 w-6 text-[#FF5B46]" />
              <p className="mt-4 font-black uppercase">{String(label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportOfferFinance() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden border border-[#27313B]">
          <Image src="/assets/cars/lamborghini/urus.jpg" alt="Performance offer" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C10] via-transparent to-transparent" />
          <div className="absolute bottom-0 p-7">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5B46]">Offers</p>
            <h3 className="mt-3 max-w-lg text-4xl font-black uppercase">Performance week upgrade</h3>
            <p className="mt-4 max-w-lg font-semibold leading-7 text-[#D5DDE6]">
              Priority test drive, delivery ceremony, and accessory credit for selected performance models.
            </p>
          </div>
        </div>
        <div className="border border-[#27313B] bg-[#111821] p-7">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF5B46]">Finance</p>
          <h3 className="mt-3 text-4xl font-black uppercase">Know the number before ignition.</h3>
          <div className="mt-8 space-y-4">
            <FinanceRow label="Ex-showroom" value="Rs 2.01Cr" />
            <FinanceRow label="Down payment" value="Rs 40.2L" />
            <FinanceRow label="Estimated EMI" value="Rs 3.35L/mo" strong />
          </div>
        </div>
      </div>
    </section>
  );
}

function SportTrustVideoContact() {
  return (
    <section className="bg-white px-4 py-16 text-[#111111] sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#E6402E]">Trust + FAQ + video + contact + locations</p>
          <h3 className="text-4xl font-black uppercase">Proof before the drive.</h3>
          <div className="mt-7 grid gap-4">
            {["Verified performance specs", "Service and warranty support", "Location and contact ready"].map((item) => (
              <div key={item} className="flex items-center gap-3 border border-[#E4E4E4] p-4 font-black">
                <CheckCircle2 className="h-5 w-5 text-[#E6402E]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <ContactStrip theme="light" accent="#E6402E" dealer="Velocity Garage" />
      </div>
    </section>
  );
}

function FamilyFirstHandTemplate() {
  const stock = vehicles.family;

  return (
    <article data-testid="active-template-preview" className="bg-[#FCFAF2] text-[#111614]">
      <FamilyNav />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-14">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D40A3B]">Family new car centre</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Choose the car your whole family can agree on.
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-[#697066]">
            Safety, seats, mileage, finance, exchange, service, and dealership support are presented clearly for first-hand vehicle buyers.
          </p>
          <div className="mt-8 grid gap-3 rounded-[30px] border border-[#E1D7BE] bg-white p-4 shadow-xl shadow-black/5 sm:grid-cols-3">
            <Metric value="64" label="family cars" dark />
            <Metric value="22" label="7 seaters" dark />
            <Metric value="8" label="service bays" dark />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.78fr]">
          <HeroModelCard vehicle={stock[0]} accent="#D40A3B" priority />
          <FamilyDecisionPanel />
        </div>
      </section>
      <FamilyCompare stock={stock} />
      <FestivalOfferRail tone="family" accent="#D40A3B" />
      <FamilyServices />
      <FamilyOffersFinance />
      <FamilyTrustFaqContact />
    </article>
  );
}

function FamilyNav() {
  return (
    <nav className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex items-center justify-between rounded-[26px] border border-[#E1D7BE] bg-white px-4 py-3 shadow-lg shadow-black/5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D40A3B] font-black text-white">S</div>
          <div>
            <p className="text-lg font-black">Saanvi Auto World</p>
            <p className="text-xs font-bold text-[#6F756C]">Pune family showroom</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm font-bold text-[#596158] lg:flex">
          <span>New Cars</span>
          <span>Safety</span>
          <span>Finance</span>
          <span>Service</span>
          <span>FAQ</span>
        </div>
        <button className="rounded-full bg-[#D40A3B] px-5 py-3 text-sm font-black text-white">Plan visit</button>
      </div>
    </nav>
  );
}

function FamilyDecisionPanel() {
  return (
    <aside className="rounded-[32px] border border-[#E1D7BE] bg-white p-5 shadow-lg shadow-black/5">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D40A3B]">Decision board</p>
      <div className="mt-5 grid gap-3">
        {[
          ["Safety", "ADAS and airbags"],
          ["Seats", "6 and 7 seater options"],
          ["EMI", "Family budget view"],
          ["Service", "Pickup and first service"],
          ["Exchange", "Upgrade old vehicle"],
        ].map(([label, copy]) => (
          <div key={label} className="rounded-2xl bg-[#F4F0E3] p-4">
            <p className="font-black">{label}</p>
            <p className="text-sm font-semibold text-[#6F756C]">{copy}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function FamilyCompare({ stock }: { stock: Vehicle[] }) {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D40A3B]">New inventory</p>
            <h3 className="text-4xl font-black">Compare the practical details.</h3>
          </div>
          <button className="w-fit rounded-full border border-[#D8CFB6] bg-white px-5 py-3 font-black">View all family cars</button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {stock.map((vehicle, index) => (
            <NewVehicleCard key={vehicle.name} vehicle={vehicle} accent="#D40A3B" priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FamilyServices() {
  return (
    <section className="bg-[#FFF1F4] px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D40A3B]">Services + EV + reviews</p>
          <h3 className="text-4xl font-black">Everything calm, readable, and repeatable.</h3>
          <p className="mt-4 font-semibold leading-7 text-[#697066]">
            Test drive, exchange, finance, service booking, EV education, reviews, and contact are grouped around family decisions.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Safety-first test drive", ShieldCheck],
            ["Hybrid and EV guidance", Zap],
            ["Exchange bonus", HeartHandshake],
            ["Service booking", Wrench],
          ].map(([label, Icon]) => (
            <IconTile key={String(label)} icon={<Icon className="h-5 w-5" />} label={String(label)} accent="#D40A3B" />
          ))}
        </div>
      </div>
    </section>
  );
}

function FamilyOffersFinance() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] border border-[#E1D7BE] bg-white p-7 shadow-lg shadow-black/5">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D40A3B]">Offers + finance</p>
          <h3 className="mt-3 text-3xl font-black">Exchange, accessories and first service support.</h3>
          <p className="mt-4 font-semibold leading-7 text-[#697066]">
            Offer carousel can auto-scroll dealer-added festival offers while still keeping the primary CTA visible.
          </p>
          <button className="mt-7 rounded-full bg-[#D40A3B] px-6 py-3 font-black text-white">See offer</button>
        </div>
        <div className="rounded-[34px] border border-[#E1D7BE] bg-[#111614] p-7 text-white">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#FF9CB1]">Finance</p>
          <h3 className="mt-3 text-3xl font-black">Plan the monthly budget.</h3>
          <div className="mt-7 space-y-4">
            <FinanceRow label="Vehicle price" value="Rs 31.34L" />
            <FinanceRow label="Down payment" value="Rs 6.26L" />
            <FinanceRow label="Estimated EMI" value="Rs 52,400/mo" strong />
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyTrustFaqContact() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D40A3B]">Trust + FAQ + video + contact + locations</p>
          <h3 className="text-4xl font-black">The last doubts are answered before enquiry.</h3>
          <div className="mt-7 space-y-3">
            {["What is the real on-road price?", "Can I test drive with family?", "Where is the nearest service centre?"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-[#E4DDC8] bg-[#FCFAF2] px-5 py-4 font-black">
                {item}
                <ChevronRight className="h-5 w-5 text-[#D40A3B]" />
              </div>
            ))}
          </div>
        </div>
        <ContactStrip theme="light" accent="#D40A3B" dealer="Saanvi Auto World" />
      </div>
    </section>
  );
}

function HeroModelCard({
  vehicle,
  accent,
  priority,
}: {
  vehicle: Vehicle;
  accent: string;
  priority?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[34px] border border-white/15 bg-white text-[#111111] shadow-2xl shadow-black/15">
      <div className="relative aspect-[16/11] min-h-[220px] overflow-hidden bg-[#ECEFF1] sm:min-h-[300px]">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
        <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black" style={{ color: accent }}>
          New 2026
        </div>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: accent }}>
            {vehicle.body}
          </p>
          <h3 className="mt-2 text-3xl font-black">{vehicle.name}</h3>
          <p className="mt-1 font-bold text-[#69706A]">{vehicle.variant}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-2xl font-black">{vehicle.price}</p>
          <p className="text-sm font-bold text-[#69706A]">{vehicle.fuel} - {vehicle.highlight}</p>
        </div>
      </div>
    </article>
  );
}

function FestivalOfferRail({
  tone,
  accent,
  dark,
}: {
  tone: "modern" | "luxury" | "sport" | "family";
  accent: string;
  dark?: boolean;
}) {
  const isSport = tone === "sport";
  const isLuxury = tone === "luxury";
  const isFamily = tone === "family";
  const sectionClass = dark
    ? isSport
      ? "bg-[#090C10] text-white"
      : "bg-[#111614] text-white"
    : isFamily
      ? "bg-[#FFF1F4] text-[#111614]"
      : "bg-white text-[#101514]";
  const cardClass = isSport
    ? "rounded-none border-[#303B46] bg-[#111821]"
    : isLuxury
      ? "rounded-[34px] border-[#4B4134] bg-[#171B1A]"
      : isFamily
        ? "rounded-[34px] border-[#F0C3CC] bg-white"
        : "rounded-[30px] border-[#DCE7E1] bg-[#F7FBF9]";
  const muted = dark ? "text-white/62" : "text-[#69706A]";

  return (
    <section className={`overflow-hidden px-4 py-14 sm:px-6 ${sectionClass}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className={`text-sm font-black uppercase ${isSport ? "tracking-[0.3em]" : "tracking-[0.22em]"}`}
              style={{ color: accent }}
            >
              Festival offers
            </p>
            <h3 className={`${isLuxury ? "font-light" : "font-black"} mt-3 max-w-3xl text-3xl sm:text-4xl`}>
              {isSport
                ? "Offer drops built for urgency."
                : isLuxury
                  ? "A premium lane for seasonal privileges."
                  : isFamily
                    ? "Festival benefits your buyer can compare calmly."
                    : "Fresh festival offers for every buyer."}
            </h3>
          </div>
          <div
            className={`w-fit border px-4 py-3 text-sm font-black ${isSport ? "rounded-none uppercase" : "rounded-full"}`}
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            2-5 live offer slots
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {festivalOffers.map((offer) => (
              <article
                key={offer.title}
                className={`flex min-w-0 flex-col overflow-hidden border p-5 shadow-xl shadow-black/10 ${cardClass}`}
                style={{ borderColor: `${accent}55` }}
              >
                <div
                  className={`mb-5 flex h-32 items-end justify-between overflow-hidden p-5 ${isSport ? "rounded-none" : "rounded-[24px]"}`}
                  style={{
                    background: isSport
                      ? `linear-gradient(135deg, ${accent}, #141D28 72%)`
                      : isLuxury
                        ? `linear-gradient(135deg, ${accent}, #3C2D1D)`
                        : `linear-gradient(135deg, ${accent}, ${accent}22)`,
                  }}
                >
                  <div className="text-white">
                    <p className="text-xs font-black uppercase tracking-[0.24em] opacity-80">{offer.note}</p>
                    <p className="mt-2 text-2xl font-black leading-tight">{offer.tag}</p>
                  </div>
                  <Sparkles className="h-12 w-12 text-white/85" aria-hidden="true" />
                </div>
                <h4 className={`${isSport ? "uppercase" : ""} text-xl font-black`}>{offer.title}</h4>
                <p className={`mt-3 text-sm font-semibold leading-6 ${muted}`}>{offer.description}</p>
                <button
                  className={`mt-5 w-fit px-5 py-3 text-sm font-black text-white ${isSport ? "rounded-none uppercase" : "rounded-full"}`}
                  style={{ backgroundColor: accent }}
                >
                  Enquire offer
                </button>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

function MiniLaunchCard({ vehicle, accent }: { vehicle: Vehicle; accent: string }) {
  return (
    <article className="rounded-[28px] border border-[#DCE7E1] bg-white p-4 shadow-lg shadow-black/5">
      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[#EEF0F2]">
        <Image src={vehicle.image} alt={vehicle.name} fill sizes="300px" className="object-cover" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: accent }}>{vehicle.body}</p>
      <h4 className="mt-2 text-xl font-black">{vehicle.name}</h4>
      <p className="mt-1 text-sm font-bold text-[#68736E]">{vehicle.price}</p>
    </article>
  );
}

function NewVehicleCard({
  vehicle,
  accent,
  priority,
}: {
  vehicle: Vehicle;
  accent: string;
  priority?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-[#E0E4DF] bg-white shadow-xl shadow-black/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF0F2]">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: accent }}>{vehicle.body}</p>
        <h4 className="mt-2 text-2xl font-black text-[#111614]">{vehicle.name}</h4>
        <p className="mt-1 font-bold text-[#69706A]">{vehicle.variant}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#F4F6F4] p-3">
            <Fuel className="h-4 w-4" style={{ color: accent }} />
            <p className="mt-2 text-xs font-bold text-[#69706A]">Fuel</p>
            <p className="font-black">{vehicle.fuel}</p>
          </div>
          <div className="rounded-2xl bg-[#F4F6F4] p-3">
            <Gauge className="h-4 w-4" style={{ color: accent }} />
            <p className="mt-2 text-xs font-bold text-[#69706A]">Highlight</p>
            <p className="font-black">{vehicle.highlight}</p>
          </div>
        </div>
        <button className="mt-5 w-full rounded-full px-5 py-3 font-black text-white" style={{ backgroundColor: accent }}>
          Enquire {vehicle.price}
        </button>
      </div>
    </article>
  );
}

function LuxuryFeatureCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="overflow-hidden rounded-[36px] border border-[#4A4034] bg-[#171B1A]">
      <div className="relative aspect-[16/9]">
        <Image src={vehicle.image} alt={vehicle.name} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="grid gap-5 p-7 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#C9A56A]">{vehicle.body}</p>
          <h4 className="mt-3 text-4xl font-black">{vehicle.name}</h4>
          <p className="mt-2 font-semibold text-[#BFB4A5]">{vehicle.variant}</p>
        </div>
        <p className="text-3xl font-black text-[#C9A56A]">{vehicle.price}</p>
      </div>
    </article>
  );
}

function LuxurySmallCard({ vehicle, priority }: { vehicle: Vehicle; priority?: boolean }) {
  return (
    <article className="grid gap-4 rounded-[30px] border border-[#3D342B] bg-[#111614] p-4 sm:grid-cols-[150px_1fr]">
      <div className="relative min-h-[130px] overflow-hidden rounded-2xl">
        <Image src={vehicle.image} alt={vehicle.name} fill priority={priority} sizes="150px" className="object-cover" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C9A56A]">{vehicle.body}</p>
        <h4 className="mt-2 text-2xl font-black">{vehicle.name}</h4>
        <p className="mt-1 text-sm font-semibold text-[#BFB4A5]">{vehicle.variant}</p>
        <p className="mt-4 text-xl font-black">{vehicle.price}</p>
      </div>
    </article>
  );
}

function IconTile({ icon, label, accent }: { icon: ReactNode; label: string; accent: string }) {
  return (
    <div className="rounded-[24px] border border-[#DCE2DC] bg-white p-5 shadow-lg shadow-black/5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ backgroundColor: accent }}>
        {icon}
      </div>
      <p className="mt-4 font-black text-[#111614]">{label}</p>
    </div>
  );
}

function OperationalCard({ title, copy, icon }: { title: string; copy: string; icon: ReactNode }) {
  return (
    <article className="rounded-[28px] border border-[#E2E8E3] bg-[#F7FAF7] p-5">
      <div className="text-[#0B6E69]">{icon}</div>
      <h4 className="mt-4 text-xl font-black">{title}</h4>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#68736E]">{copy}</p>
    </article>
  );
}

function Metric({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className={dark ? "rounded-2xl bg-[#F4F0E3] p-4 text-[#111614]" : "rounded-2xl border border-white/10 bg-white/5 p-4"}>
      <p className="text-2xl font-black">{value}</p>
      <p className={dark ? "text-xs font-bold text-[#687068]" : "text-xs font-bold text-white/60"}>{label}</p>
    </div>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#303B46] bg-[#0B1016] p-3">
      <p className="text-xs font-bold uppercase text-[#8793A0]">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function FinanceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
      <span className="font-semibold text-white/65">{label}</span>
      <span className={strong ? "text-2xl font-black text-white" : "font-black text-white"}>{value}</span>
    </div>
  );
}

function ContactStrip({
  theme,
  accent,
  dealer,
}: {
  theme: "light" | "dark";
  accent: string;
  dealer: string;
}) {
  const light = theme === "light";
  return (
    <div className={`mt-8 rounded-[32px] border p-6 ${light ? "border-[#E2E2E2] bg-white text-[#111111]" : "border-white/10 bg-white/5 text-white"}`}>
      <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: accent }}>Contact + locations</p>
      <h3 className="mt-3 text-3xl font-black">{dealer}</h3>
      <div className="mt-6 grid gap-3">
        <div className="flex items-center gap-3 font-bold">
          <Phone className="h-5 w-5" style={{ color: accent }} />
          +91 98765 43210
        </div>
        <div className="flex items-center gap-3 font-bold">
          <MapPin className="h-5 w-5" style={{ color: accent }} />
          Main showroom, service centre, delivery bay
        </div>
        <div className="flex items-center gap-3 font-bold">
          <MessageSquare className="h-5 w-5" style={{ color: accent }} />
          Enquiry form, WhatsApp and call actions
        </div>
      </div>
      <button className="mt-6 inline-flex items-center rounded-full px-6 py-3 font-black text-white" style={{ backgroundColor: accent }}>
        Send enquiry
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}
