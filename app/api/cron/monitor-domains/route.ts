import { NextResponse } from 'next/server'
import { monitorSSLCertificates, monitorDomainExpiry } from '@/lib/services/monitoring-service'

/**
 * GET /api/cron/monitor-domains
 * Cron job endpoint to monitor SSL and domain expiry
 * 
 * Setup in Vercel:
 * 1. Go to Project Settings then Cron Jobs
 * 2. Add cron expression (runs every 12 hours)
 * 3. Set path to /api/cron/monitor-domains
 */
export async function GET(request: Request) {
    try {
        // Verify cron secret to prevent unauthorized access
        const authHeader = request.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET || 'development-secret'

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.log('[Cron] Running domain monitoring...')

        // Check SSL certificates
        const sslResults = await monitorSSLCertificates()

        // Check domain expiry
        const expiryResults = await monitorDomainExpiry()

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ssl: sslResults,
            expiry: expiryResults
        })
    } catch (error) {
        console.error('Cron job error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
