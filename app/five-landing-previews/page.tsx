"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

type DesignId = "editorial" | "command" | "velocity" | "local" | "showroom";

type LandingDesign = {
    id: DesignId;
    number: string;
    name: string;
    mood: string;
    image: string;
    accent: string;
    dark?: boolean;
};

const designs: LandingDesign[] = [
    {
        id: "editorial",
        number: "1",
        name: "Editorial Clean",
        mood: "Minimal white, premium serif, calm setup story",
        image: "/design-previews/five-board/editorial-clean.png",
        accent: "bg-black text-white",
    },
    {
        id: "command",
        number: "2",
        name: "Command Center",
        mood: "Dark SaaS control room with lead metrics",
        image: "/design-previews/five-board/command-center.png",
        accent: "bg-blue-500 text-white",
        dark: true,
    },
    {
        id: "velocity",
        number: "3",
        name: "Launch Velocity",
        mood: "Fast, bright, conversion-focused launch energy",
        image: "/design-previews/five-board/launch-velocity.png",
        accent: "bg-yellow-400 text-slate-950",
    },
    {
        id: "local",
        number: "4",
        name: "Trusted Local",
        mood: "Warm green, Indian dealer friendly, approachable",
        image: "/design-previews/five-board/trusted-local.png",
        accent: "bg-emerald-700 text-white",
    },
    {
        id: "showroom",
        number: "5",
        name: "Showroom Luxury",
        mood: "Black luxury showroom, premium and cinematic",
        image: "/design-previews/five-board/showroom-luxury.png",
        accent: "bg-white text-black",
        dark: true,
    },
];

export default function FiveLandingPreviewsPage() {
    const [selectedId, setSelectedId] = useState<DesignId>("editorial");
    const selected = useMemo(
        () => designs.find((design) => design.id === selectedId) ?? designs[0],
        [selectedId]
    );

    return (
        <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                                Dealer Site Pro landing page choices
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                                Pick one of the 5 designs from your image
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                                These previews use the exact page panels cropped from your uploaded design board, so the images match what you approved.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition hover:border-slate-400"
                        >
                            Current home <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {designs.map((design) => {
                            const isSelected = selected.id === design.id;
                            return (
                                <button
                                    key={design.id}
                                    type="button"
                                    onClick={() => setSelectedId(design.id)}
                                    className={`group rounded-lg border bg-white p-3 text-left shadow-sm transition ${
                                        isSelected
                                            ? "border-slate-950 ring-2 ring-slate-950/10"
                                            : "border-slate-200 hover:border-slate-400"
                                    }`}
                                >
                                    <div className="relative aspect-[0.38] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                                        <Image
                                            src={design.image}
                                            alt={`${design.name} full landing page preview`}
                                            fill
                                            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-xs font-black text-slate-500">Design {design.number}</p>
                                            <h2 className="mt-1 text-sm font-black">{design.name}</h2>
                                        </div>
                                        {isSelected ? (
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                                                <Check className="h-4 w-4" />
                                            </span>
                                        ) : null}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
                <aside className={`h-fit rounded-xl border p-5 shadow-sm ${selected.dark ? "border-slate-800 bg-[#081014] text-white" : "border-slate-200 bg-white"}`}>
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${selected.dark ? "text-slate-400" : "text-slate-500"}`}>
                        Selected Design {selected.number}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight">{selected.name}</h2>
                    <p className={`mt-3 text-sm leading-6 ${selected.dark ? "text-slate-300" : "text-slate-600"}`}>
                        {selected.mood}
                    </p>
                    <div className={`mt-6 inline-flex rounded-md px-4 py-2 text-sm font-black ${selected.accent}`}>
                        Previewing now
                    </div>
                    <p className={`mt-6 text-sm leading-6 ${selected.dark ? "text-slate-400" : "text-slate-500"}`}>
                        Scroll the full preview on the right. After you choose one, I’ll turn that design into the real landing page.
                    </p>
                </aside>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
                    <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <Image
                            src={selected.image}
                            alt={`${selected.name} full landing page`}
                            width={430}
                            height={1132}
                            sizes="(min-width: 1024px) 430px, 94vw"
                            className="h-auto w-full"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-2xl font-black tracking-tight">All 5 Full Page Previews</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                        {designs.map((design) => (
                            <figure key={design.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                                <Image
                                    src={design.image}
                                    alt={`${design.name} overview`}
                                    width={326}
                                    height={862}
                                    className="h-auto w-full rounded-md border border-slate-200"
                                />
                                <figcaption className="mt-3 text-sm font-black">
                                    {design.number}. {design.name}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
