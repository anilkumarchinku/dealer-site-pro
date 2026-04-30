"use client"

import { Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ONBOARDING_SOCIAL_FIELDS,
    type OnboardingSocialField,
    type OnboardingValidationErrors,
} from "@/lib/validations/onboarding"

export type SocialLinksValue = Record<OnboardingSocialField, string>

type SocialLinksFieldsProps = {
    values: SocialLinksValue
    errors: OnboardingValidationErrors
    onChange: (field: OnboardingSocialField, value: string) => void
    placeholders?: Partial<Record<OnboardingSocialField, string>>
}

const DEFAULT_LABELS: Record<OnboardingSocialField, string> = {
    facebook:  "Facebook",
    instagram: "Instagram",
    twitter:   "X / Twitter",
    youtube:   "YouTube",
    linkedin:  "LinkedIn",
}

const DEFAULT_PLACEHOLDERS: Record<OnboardingSocialField, string> = {
    facebook:  "https://facebook.com/yourshowroom",
    instagram: "https://instagram.com/yourshowroom",
    twitter:   "https://x.com/yourshowroom",
    youtube:   "https://youtube.com/@yourshowroom",
    linkedin:  "https://linkedin.com/company/yourshowroom",
}

export function SocialLinksFields({
    values,
    errors,
    onChange,
    placeholders = {},
}: SocialLinksFieldsProps) {
    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                <Globe className="w-4 h-4" />
                Social Media Links (Optional)
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {ONBOARDING_SOCIAL_FIELDS.map((field) => (
                    <div key={field} className="space-y-1">
                        <Label>{DEFAULT_LABELS[field]}</Label>
                        <Input
                            placeholder={placeholders[field] ?? DEFAULT_PLACEHOLDERS[field]}
                            value={values[field]}
                            onChange={(e) => onChange(field, e.target.value)}
                            error={errors[field]}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
