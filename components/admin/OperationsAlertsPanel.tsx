'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'

type AlertLevel = 'critical' | 'warning' | 'info'

interface OperationAlert {
    id: string
    level: AlertLevel
    title: string
    detail: string
    count?: number
}

const levelClass: Record<AlertLevel, string> = {
    critical: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
}

export function OperationsAlertsPanel() {
    const [loading, setLoading] = useState(true)
    const [alerts, setAlerts] = useState<OperationAlert[]>([])
    const [error, setError] = useState('')

    const load = () => {
        setLoading(true)
        setError('')
        fetch('/api/admin/operations-alerts', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error)
                    return
                }
                setAlerts(data.alerts ?? [])
            })
            .catch(() => setError('Failed to load operations alerts'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <section className="mb-6 rounded-2xl border border-[#E7E0D7] bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 text-base font-bold">
                        <AlertTriangle className="h-4 w-4 text-[#A8793A]" />
                        Operations health
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Provider config, failed syncs, domain issues, and payment/webhook attention.
                    </p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E7E0D7] px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Refresh
                </button>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            ) : loading ? (
                <div className="rounded-xl border border-dashed border-[#E7E0D7] p-4 text-sm text-muted-foreground">
                    Checking operations health...
                </div>
            ) : alerts.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    No operations alerts right now.
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {alerts.map((alert) => (
                        <article key={alert.id} className={`rounded-xl border p-3 ${levelClass[alert.level]}`}>
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-sm font-bold">{alert.title}</h3>
                                {typeof alert.count === 'number' && (
                                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold">{alert.count}</span>
                                )}
                            </div>
                            <p className="mt-1 text-xs leading-5 opacity-85">{alert.detail}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}
