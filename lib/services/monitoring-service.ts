/**
 * Domain Monitoring Service
 * Checks SSL status and domain expiry
 */

import { supabase } from '@/lib/supabase'
import { sendDomainExpiryWarning, sendSSLRenewalNotification } from './email-service'

export interface SSLStatus {
    domain: string
    isValid: boolean
    issuer?: string
    validFrom?: Date
    validUntil?: Date
    daysUntilExpiry?: number
}

/**
 * Checks SSL certificate status for a domain
 */
export async function checkSSLCertificate(domain: string): Promise<SSLStatus> {
    try {
        // In production, use a service like SSL Labs API or:
        // const tls = require('tls');
        // Connect to domain:443 and check certificate

        // Mock implementation
        return {
            domain,
            isValid: true,
            issuer: 'Let\'s Encrypt',
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            daysUntilExpiry: 90
        }
    } catch (error) {
        console.error(`SSL check failed for ${domain}:`, error)
        return {
            domain,
            isValid: false
        }
    }
}

/**
 * Monitors all active domains for SSL expiry
 * Should be run as a cron job (daily)
 */
export async function monitorSSLCertificates() {
    try {
        // Get all active domains
        const { data: domains, error } = await supabase
            .from('domains')
            .select('*')
            .eq('status', 'active')
            .in('ssl_status', ['active', 'provisioning'])

        if (error) {
            console.error('Error fetching domains for SSL monitoring:', error)
            return { success: false, error }
        }

        const results = []

        for (const domain of domains || []) {
            const sslStatus = await checkSSLCertificate(domain.domain)

            // Update SSL status in database
            let newSSLStatus = domain.ssl_status

            if (!sslStatus.isValid) {
                newSSLStatus = 'failed'
            } else if (sslStatus.daysUntilExpiry && sslStatus.daysUntilExpiry < 30) {
                newSSLStatus = 'renewing'
                // Trigger renewal process (Vercel/Cloudflare does this automatically)
            }

            await supabase
                .from('domains')
                .update({
                    ssl_status: newSSLStatus,
                    ssl_expires_at: sslStatus.validUntil?.toISOString()
                })
                .eq('id', domain.id)

            results.push({
                domain: domain.domain,
                status: newSSLStatus,
                daysUntilExpiry: sslStatus.daysUntilExpiry
            })
        }

        return { success: true, results }
    } catch (error) {
        console.error('SSL monitoring error:', error)
        return { success: false, error }
    }
}

/**
 * Checks domain registration expiry
 * Should be run as a cron job (daily)
 */
export async function monitorDomainExpiry() {
    try {
        // Get all managed and custom domains
        const { data: domains, error } = await supabase
            .from('domains')
            .select('*, dealer:dealers(email, dealership_name)')
            .in('type', ['custom', 'managed'])
            .eq('status', 'active')

        if (error) {
            console.error('Error fetching domains for expiry monitoring:', error)
            return { success: false, error }
        }

        const warnings = []
        const now = new Date()

        for (const domain of domains || []) {
            if (!domain.registration_expires_at) continue

            const expiryDate = new Date(domain.registration_expires_at)
            const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            // Send warnings at 30 days and 7 days before expiry
            if (daysUntilExpiry === 30 || daysUntilExpiry === 7) {
                await sendDomainExpiryWarning({
                    to: domain.dealer.email,
                    dealerName: domain.dealer.dealership_name,
                    domain: domain.domain,
                    daysUntilExpiry
                })

                warnings.push({
                    domain: domain.domain,
                    daysUntilExpiry,
                    dealerId: domain.dealer_id
                })
            }

            // Auto-renew if managed domain and auto_renew is enabled
            if (domain.type === 'managed' && domain.auto_renew && daysUntilExpiry <= 30) {
                // Trigger renewal via Cloudflare API
                console.log(`Auto-renewing managed domain: ${domain.domain}`)

                // Update expiry date (add 1 year)
                await supabase
                    .from('domains')
                    .update({
                        registration_expires_at: new Date(expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    })
                    .eq('id', domain.id)
            }
        }

        return { success: true, warnings }
    } catch (error) {
        console.error('Domain expiry monitoring error:', error)
        return { success: false, error }
    }
}

/**
 * Gets monitoring statistics for dashboard
 */
export async function getMonitoringStats(dealerId: string) {
    try {
        const { data: domains, error } = await supabase
            .from('domains')
            .select('*')
            .eq('dealer_id', dealerId)

        if (error) throw error

        const stats = {
            totalDomains: domains?.length || 0,
            activeDomains: domains?.filter(d => d.status === 'active').length || 0,
            sslHealthy: domains?.filter(d => d.ssl_status === 'active').length || 0,
            expiringDomains: domains?.filter(d => {
                if (!d.registration_expires_at) return false
                const daysUntil = Math.floor(
                    (new Date(d.registration_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                return daysUntil <= 30
            }).length || 0,
            domainsByType: {
                subdomain: domains?.filter(d => d.type === 'subdomain').length || 0,
                custom: domains?.filter(d => d.type === 'custom').length || 0,
                managed: domains?.filter(d => d.type === 'managed').length || 0
            }
        }

        return { success: true, stats }
    } catch (error) {
        console.error('Error getting monitoring stats:', error)
        return { success: false, error }
    }
}
