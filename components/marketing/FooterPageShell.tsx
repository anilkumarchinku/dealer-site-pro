import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

type PageAction = {
    label: string;
    href: string;
};

type PageItem = {
    title: string;
    description: string;
    href?: string;
    meta?: string;
};

type PageSection = {
    title: string;
    items: PageItem[];
};

type FooterPageShellProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    primaryAction: PageAction;
    secondaryAction?: PageAction;
    sections: PageSection[];
};

export function FooterPageShell({
    title,
    description,
    icon: Icon,
    primaryAction,
    secondaryAction,
    sections,
}: FooterPageShellProps) {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-[#f8f5ef] text-slate-950">
                <section className="border-b border-black/10 bg-[radial-gradient(circle_at_18%_20%,rgba(168,121,58,0.16),transparent_32%),linear-gradient(135deg,#fffdfa,#f3ede3)]">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-3xl">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-black/10 bg-white shadow-sm">
                                <Icon className="h-7 w-7 text-[#7C4F12]" aria-hidden="true" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
                            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600">
                                {description}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={primaryAction.href}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#7C4F12] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#633F0E]"
                                >
                                    {primaryAction.label}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                {secondaryAction && (
                                    <Link
                                        href={secondaryAction.href}
                                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-black/10 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-50"
                                    >
                                        {secondaryAction.label}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10">
                        {sections.map((section) => (
                            <section key={section.title}>
                                <div className="mb-5 flex items-end justify-between gap-4">
                                    <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {section.items.map((item) => {
                                        const content = (
                                            <div className="h-full rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                                {item.meta && (
                                                    <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#7C4F12]">
                                                        {item.meta}
                                                    </p>
                                                )}
                                                <h3 className="text-lg font-black leading-snug">{item.title}</h3>
                                                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.description}</p>
                                                {item.href && (
                                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#7C4F12]">
                                                        Open
                                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </div>
                                        );

                                        if (!item.href) {
                                            return <div key={item.title}>{content}</div>;
                                        }

                                        return (
                                            <Link key={item.title} href={item.href} className="block h-full">
                                                {content}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
