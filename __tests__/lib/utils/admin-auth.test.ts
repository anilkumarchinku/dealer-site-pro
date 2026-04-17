import { describe, expect, it } from "vitest"

import { isAdminEmail, parseAdminEmails } from "@/lib/utils/admin-auth"

describe("admin-auth utils", () => {
    it("normalizes and filters the admin email list", () => {
        expect(parseAdminEmails(" Admin@One.com, ,ADMIN@two.com  ")).toEqual([
            "admin@one.com",
            "admin@two.com",
        ])
    })

    it("matches admin emails case-insensitively", () => {
        expect(isAdminEmail("Owner@Dealer.com", "owner@dealer.com, admin@example.com")).toBe(true)
        expect(isAdminEmail("staff@dealer.com", "owner@dealer.com, admin@example.com")).toBe(false)
    })
})
