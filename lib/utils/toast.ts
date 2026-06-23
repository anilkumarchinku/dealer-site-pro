/**
 * Minimal toast utility — no external deps, no provider required.
 * Dark-mode aware, stacks multiple toasts, and supports success/error/info/warning.
 */

type ToastVariant = "success" | "error" | "info" | "warning";

/** Optional inline call-to-action rendered as a link button inside the toast. */
interface ToastOptions {
    action?: { label: string; href: string };
}

interface VariantStyle {
    light: { bg: string; color: string; border: string; dot: string };
    dark: { bg: string; color: string; border: string; dot: string };
}

const VARIANTS: Record<ToastVariant, VariantStyle> = {
    success: {
        light: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
        dark:  { bg: "#0b2417", color: "#86efac", border: "#14532d", dot: "#22c55e" },
    },
    error: {
        light: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
        dark:  { bg: "#2a1212", color: "#fca5a5", border: "#7f1d1d", dot: "#ef4444" },
    },
    info: {
        light: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
        dark:  { bg: "#0f1d33", color: "#93c5fd", border: "#1e3a8a", dot: "#3b82f6" },
    },
    warning: {
        light: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", dot: "#f59e0b" },
        dark:  { bg: "#2a1f06", color: "#fcd34d", border: "#78350f", dot: "#f59e0b" },
    },
};

// Active toasts, newest last — used to stack upward from the bottom-right.
const active: HTMLElement[] = [];
const GAP = 12;
const BOTTOM = 24;

function reposition() {
    let offset = BOTTOM;
    // Newest on the bottom, older ones pushed up.
    for (let i = active.length - 1; i >= 0; i--) {
        const el = active[i];
        el.style.bottom = `${offset}px`;
        offset += el.offsetHeight + GAP;
    }
}

function show(message: string, variant: ToastVariant, options?: ToastOptions) {
    if (typeof document === "undefined") return;

    const isDark = document.documentElement.classList.contains("dark");
    const palette = VARIANTS[variant][isDark ? "dark" : "light"];

    const el = document.createElement("div");
    el.setAttribute("role", variant === "error" ? "alert" : "status");
    el.setAttribute("aria-live", variant === "error" ? "assertive" : "polite");
    el.style.cssText = [
        "position:fixed",
        "right:24px",
        "z-index:9999",
        "display:flex",
        "align-items:center",
        "gap:8px",
        "padding:12px 16px",
        "border-radius:10px",
        "border:1px solid",
        `background:${palette.bg}`,
        `color:${palette.color}`,
        `border-color:${palette.border}`,
        "font-size:14px",
        "font-weight:500",
        "box-shadow:0 4px 12px rgba(0,0,0,0.15)",
        "transition:opacity 0.3s ease, transform 0.3s ease",
        "opacity:0",
        "transform:translateY(8px)",
        "max-width:360px",
        "line-height:1.4",
    ].join(";");

    const dot = document.createElement("span");
    dot.style.cssText = [
        "width:8px",
        "height:8px",
        "border-radius:50%",
        "flex-shrink:0",
        `background:${palette.dot}`,
    ].join(";");

    el.appendChild(dot);

    const text = document.createElement("span");
    text.textContent = message;
    text.style.cssText = "flex:1";
    el.appendChild(text);

    // Optional inline action (e.g. "Sign in") rendered as a small link button.
    if (options?.action) {
        const link = document.createElement("a");
        link.href = options.action.href;
        link.textContent = options.action.label;
        link.style.cssText = [
            "flex-shrink:0",
            "margin-left:4px",
            "padding:5px 12px",
            "border-radius:8px",
            "font-weight:700",
            "font-size:13px",
            "text-decoration:none",
            "white-space:nowrap",
            `color:${palette.dot}`,
            `border:1px solid ${palette.border}`,
        ].join(";");
        link.addEventListener("click", (e) => e.stopPropagation());
        el.appendChild(link);
    }

    document.body.appendChild(el);
    active.push(el);
    reposition();

    // Animate in on the next frame.
    requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
    });

    const dismiss = () => {
        const idx = active.indexOf(el);
        if (idx === -1) return;
        active.splice(idx, 1);
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        setTimeout(() => { el.remove(); reposition(); }, 300);
        reposition();
    };

    const timer = setTimeout(dismiss, 3500);
    el.addEventListener("click", () => { clearTimeout(timer); dismiss(); });
}

export const toast = {
    success: (message: string, options?: ToastOptions) => show(message, "success", options),
    error:   (message: string, options?: ToastOptions) => show(message, "error", options),
    info:    (message: string, options?: ToastOptions) => show(message, "info", options),
    warning: (message: string, options?: ToastOptions) => show(message, "warning", options),
};
