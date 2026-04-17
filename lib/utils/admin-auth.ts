export function parseAdminEmails(raw?: string | null): string[] {
    return (raw ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
}

export function isAdminEmail(email?: string | null, raw?: string | null): boolean {
    if (!email) return false
    return parseAdminEmails(raw).includes(email.trim().toLowerCase())
}
