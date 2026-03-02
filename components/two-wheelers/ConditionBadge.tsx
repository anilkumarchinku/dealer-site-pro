import type { TwoWheelerConditionGrade } from "@/lib/types/two-wheeler"

interface Props {
    grade:    TwoWheelerConditionGrade
    showLabel?: boolean
}

const CONFIG = {
    A: { color: "bg-green-100 text-green-700 border-green-300",  label: "Excellent" },
    B: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Good"    },
    C: { color: "bg-orange-100 text-orange-700 border-orange-300", label: "Fair"    },
}

export function ConditionBadge({ grade, showLabel = true }: Props) {
    const cfg = CONFIG[grade]
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${cfg.color}`}>
            Grade {grade}{showLabel && ` — ${cfg.label}`}
        </span>
    )
}
