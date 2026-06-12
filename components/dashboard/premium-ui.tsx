import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "amber" | "violet" | "slate" | "red";

const toneStyles: Record<Tone, { card: string; icon: string; text: string }> = {
    blue:   { card: "border-blue-200/70 bg-blue-50/60 dark:border-blue-500/20 dark:bg-blue-500/10",       icon: "bg-blue-600 text-white",        text: "text-blue-600 dark:text-blue-300" },
    green:  { card: "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-500/10", icon: "bg-emerald-600 text-white", text: "text-emerald-600 dark:text-emerald-300" },
    amber:  { card: "border-amber-200/70 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10",    icon: "bg-amber-500 text-white",       text: "text-amber-600 dark:text-amber-300" },
    violet: { card: "border-violet-200/70 bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/10", icon: "bg-violet-600 text-white",     text: "text-violet-600 dark:text-violet-300" },
    slate:  { card: "border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-white/5",                icon: "bg-slate-900 text-white",       text: "text-slate-700 dark:text-slate-200" },
    red:    { card: "border-red-200/70 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/10",            icon: "bg-red-600 text-white",         text: "text-red-600 dark:text-red-300" },
};

export function PremiumPageHeader({
    eyebrow,
    title,
    description,
    actions,
    children,
    className,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <section className={cn(
            "relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm dark:bg-card/80 sm:p-6",
            className
        )}>
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                    {eyebrow && (
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {actions}
                    </div>
                )}
            </div>
            {children && <div className="relative z-10 mt-5">{children}</div>}
        </section>
    );
}

export function PremiumStatCard({
    label,
    value,
    helper,
    icon: Icon,
    tone = "slate",
    loading,
    className,
}: {
    label: string;
    value: ReactNode;
    helper?: ReactNode;
    icon: LucideIcon;
    tone?: Tone;
    loading?: boolean;
    className?: string;
}) {
    const styles = toneStyles[tone];

    return (
        <div className={cn(
            "rounded-2xl border p-4 shadow-sm transition-colors",
            styles.card,
            className
        )}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <div className={cn("mt-2 text-2xl font-black tracking-tight", styles.text)}>
                        {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded-md bg-muted" /> : value}
                    </div>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shadow-sm", styles.icon)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {helper && <p className="mt-3 text-xs font-medium text-muted-foreground">{helper}</p>}
        </div>
    );
}

export function PremiumPanel({
    title,
    description,
    icon: Icon,
    action,
    children,
    className,
    contentClassName,
}: {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <section className={cn(
            "rounded-2xl border border-border/70 bg-card/90 shadow-sm dark:bg-card/80",
            className
        )}>
            {(title || description || action) && (
                <div className="flex flex-col gap-3 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        {Icon && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                        <div>
                            {title && <h2 className="text-lg font-black tracking-tight text-foreground">{title}</h2>}
                            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                        </div>
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={cn("p-5", contentClassName)}>{children}</div>
        </section>
    );
}

export function PremiumEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
                <Icon className="h-7 w-7" />
            </div>
            <p className="font-black text-foreground">{title}</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
