/**
 * Minimal toast utility — no external deps.
 * Creates a styled floating notification that auto-dismisses.
 */

type ToastVariant = "success" | "error";

function show(message: string, variant: ToastVariant) {
    if (typeof document === "undefined") return;

    const id = `toast-${Date.now()}`;
    const el = document.createElement("div");
    el.id = id;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    const isSuccess = variant === "success";
    el.style.cssText = [
        "position:fixed",
        "bottom:24px",
        "right:24px",
        "z-index:9999",
        "display:flex",
        "align-items:center",
        "gap:8px",
        "padding:12px 16px",
        "border-radius:10px",
        "border:1px solid",
        isSuccess
            ? "background:#f0fdf4;color:#15803d;border-color:#bbf7d0"
            : "background:#fef2f2;color:#dc2626;border-color:#fecaca",
        "font-size:14px",
        "font-weight:500",
        "box-shadow:0 4px 12px rgba(0,0,0,0.1)",
        "transition:opacity 0.3s ease",
        "opacity:1",
        "max-width:360px",
        "line-height:1.4",
    ].join(";");

    const dot = document.createElement("span");
    dot.style.cssText = [
        "width:8px",
        "height:8px",
        "border-radius:50%",
        "flex-shrink:0",
        isSuccess ? "background:#22c55e" : "background:#ef4444",
    ].join(";");

    el.appendChild(dot);
    el.appendChild(document.createTextNode(message));
    document.body.appendChild(el);

    // Auto-dismiss after 3 s
    const dismiss = () => {
        el.style.opacity = "0";
        setTimeout(() => { el.remove(); }, 300);
    };

    const timer = setTimeout(dismiss, 3000);
    el.addEventListener("click", () => { clearTimeout(timer); dismiss(); });
}

export const toast = {
    success: (message: string) => show(message, "success"),
    error:   (message: string) => show(message, "error"),
};
