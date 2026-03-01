'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CHECKLIST_ITEMS = [
    { id: 'gst',       label: 'GST Registration (GSTIN verified)',         points: 20 },
    { id: 'address',   label: 'Physical address with full details added',   points: 15 },
    { id: 'phone',     label: 'Phone number verified via OTP',              points: 15 },
    { id: 'logo',      label: 'Dealership logo uploaded',                   points: 10 },
    { id: 'inventory', label: 'At least 5 vehicles in inventory',           points: 15 },
    { id: 'photos',    label: 'Vehicle photos added (min 1 photo per car)', points: 10 },
    { id: 'hours',     label: 'Working hours set',                          points: 5  },
    { id: 'whatsapp',  label: 'WhatsApp number added',                      points: 5  },
    { id: 'social',    label: 'At least 1 social media link added',         points: 5  },
]

interface DealerInspectionChecklistProps {
    /** Pre-checked items from DB / dealer profile */
    completed?: string[]
    isVerified?: boolean
    onSave?: (completed: string[]) => void
}

export function DealerInspectionChecklist({
    completed: initialCompleted = [],
    isVerified = false,
    onSave,
}: DealerInspectionChecklistProps) {
    const [checked, setChecked] = useState<string[]>(initialCompleted)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const score = checked.reduce((sum, id) => {
        const item = CHECKLIST_ITEMS.find(i => i.id === id)
        return sum + (item?.points ?? 0)
    }, 0)

    const toggle = (id: string) => {
        setChecked(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)
        await onSave?.(checked)
        setSaving(false)
        setSaved(true)
    }

    const scoreColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'
    const barColor   = score >= 80 ? 'bg-emerald-500'  : score >= 50 ? 'bg-amber-500'  : 'bg-red-400'

    return (
        <div className="space-y-5">
            {/* Score bar */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Verification Score</span>
                    <span className={`text-2xl font-bold ${scoreColor}`}>{score}<span className="text-sm font-normal text-gray-400">/100</span></span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
                </div>
                {score >= 80 ? (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> You qualify for DealerSite Verified badge!
                    </p>
                ) : (
                    <p className="text-xs text-gray-500 mt-2">Complete more items to earn the Verified badge (need 80+)</p>
                )}
            </div>

            {/* Checklist */}
            <div className="space-y-2">
                {CHECKLIST_ITEMS.map(item => {
                    const done = checked.includes(item.id)
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => toggle(item.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                done
                                    ? 'border-emerald-200 bg-emerald-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            {done
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                : <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                            }
                            <span className={`flex-1 text-sm ${done ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                                {item.label}
                            </span>
                            <span className="text-xs font-semibold text-gray-400">+{item.points}pts</span>
                        </button>
                    )
                })}
            </div>

            {onSave && (
                <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Checklist'}
                </Button>
            )}
        </div>
    )
}
