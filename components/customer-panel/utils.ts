export function formatDate(value?: string | null) {
    if (!value) return "Not scheduled"
    return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function formatPrice(paise?: number | null) {
    if (!paise) return "Price on request"
    return `₹${Math.round(paise / 100).toLocaleString("en-IN")}`
}

export function formatServiceType(type: string) {
    return type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export function getStatusVariant(status: string): "success" | "warning" | "info" | "outline" | "destructive" {
    const s = status.toLowerCase()
    if (["completed", "converted", "confirmed", "approved"].includes(s)) return "success"
    if (["pending", "new"].includes(s)) return "warning"
    if (["assigned", "qualified", "contacted", "in_progress"].includes(s)) return "info"
    if (["cancelled", "lost", "rejected"].includes(s)) return "destructive"
    return "outline"
}
