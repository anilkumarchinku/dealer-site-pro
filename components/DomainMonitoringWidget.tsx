'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Shield, AlertTriangle, CheckCircle2, Globe } from 'lucide-react'

interface MonitoringStats {
    totalDomains: number
    activeDomains: number
    sslHealthy: number
    expiringDomains: number
    domainsByType: {
        subdomain: number
        custom: number
        managed: number
    }
}

export default function DomainMonitoringWidget({ dealerId }: { dealerId: string }) {
    const [stats, setStats] = useState<MonitoringStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [dealerId])

    async function fetchStats() {
        try {
            const response = await fetch(`/api/domains/stats?dealer_id=${dealerId}`)
            const data = await response.json()

            if (data.success) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching monitoring stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!stats) {
        return null
    }

    const healthPercentage = stats.totalDomains > 0
        ? Math.round((stats.sslHealthy / stats.totalDomains) * 100)
        : 100

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Domain Health Monitor</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.totalDomains}</p>
                    <p className="text-xs text-gray-600">Total Domains</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.activeDomains}</p>
                    <p className="text-xs text-gray-600">Active</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{stats.sslHealthy}</p>
                    <p className="text-xs text-gray-600">SSL Healthy</p>
                </div>

                <div className={`text-center p-4 rounded-lg border ${stats.expiringDomains > 0
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                    <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${stats.expiringDomains > 0 ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                    <p className={`text-2xl font-bold ${stats.expiringDomains > 0 ? 'text-yellow-600' : 'text-gray-400'
                        }`}>{stats.expiringDomains}</p>
                    <p className="text-xs text-gray-600">Expiring Soon</p>
                </div>
            </div>

            {/* Health Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Health</span>
                    <span className="text-sm font-bold text-green-600">{healthPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${healthPercentage >= 90 ? 'bg-green-500' :
                                healthPercentage >= 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                            }`}
                        style={{ width: `${healthPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Domain Types Breakdown */}
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">FREE: {stats.domainsByType.subdomain}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">PRO: {stats.domainsByType.custom}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">PREMIUM: {stats.domainsByType.managed}</span>
                </div>
            </div>

            {/* Warnings */}
            {stats.expiringDomains > 0 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-yellow-900">Action Required</p>
                        <p className="text-xs text-yellow-700">
                            {stats.expiringDomains} domain{stats.expiringDomains > 1 ? 's' : ''} expiring within 30 days.
                            Check your email for renewal instructions.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
