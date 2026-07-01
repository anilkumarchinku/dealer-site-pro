'use client'

import { useEffect, useRef } from 'react'

import { isSupabaseReady, supabase } from '@/lib/supabase'

interface UseDashboardRealtimeRefreshOptions {
    tables: string[]
    onChange: () => void
    debounceMs?: number
}

export function useDashboardRealtimeRefresh({
    tables,
    onChange,
    debounceMs = 600,
}: UseDashboardRealtimeRefreshOptions) {
    const callbackRef = useRef(onChange)
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        callbackRef.current = onChange
    }, [onChange])

    useEffect(() => {
        if (!isSupabaseReady() || tables.length === 0) return undefined

        const channel = supabase.channel(`dashboard-refresh:${tables.join(',')}`)
        const scheduleRefresh = () => {
            if (timerRef.current) window.clearTimeout(timerRef.current)
            timerRef.current = window.setTimeout(() => callbackRef.current(), debounceMs)
        }

        tables.forEach((table) => {
            channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                scheduleRefresh
            )
        })

        channel.subscribe()

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current)
            supabase.removeChannel(channel)
        }
    }, [debounceMs, tables])
}
