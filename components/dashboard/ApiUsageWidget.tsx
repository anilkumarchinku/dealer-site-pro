/**
 * ApiUsageWidget
 * Shows dealer's API usage statistics (Plan 1 pricing)
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UsageStats {
    totalCalls: number;
    totalSpent: number;
    recentCalls: Array<{
        api_type: string;
        cost_inr: number;
        response_success: boolean;
        created_at: string;
        request_params?: { rc?: string };
    }>;
}

export function ApiUsageWidget() {
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/credits/usage-stats');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to load usage stats');
                }

                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatApiType = (type: string) => {
        const labels: Record<string, string> = {
            rc_verification: 'RC Lookup',
            rc_challan: 'Challan Check',
            pan_verification: 'PAN Verification',
            dl_verification: 'DL Verification',
        };
        return labels[type] || type;
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <CardTitle className="text-base">API Usage (Plan 1)</CardTitle>
                            <CardDescription>Track your RC lookup costs</CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">₹{stats?.totalSpent.toFixed(2) || '0.00'}</p>
                        <p className="text-xs text-muted-foreground">{stats?.totalCalls || 0} calls total</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {stats && stats.recentCalls.length > 0 ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Recent Activity
                        </div>
                        {stats.recentCalls.slice(0, 5).map((call, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-center gap-2">
                                    {call.response_success ? (
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {formatApiType(call.api_type)}
                                        </p>
                                        {call.request_params?.rc && (
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {call.request_params.rc}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">
                                        {formatTime(call.created_at)}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-xs font-medium border-blue-200 bg-blue-50 text-blue-700"
                                    >
                                        ₹{call.cost_inr.toFixed(2)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                        No API calls yet. Try the RC Lookup widget above!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
