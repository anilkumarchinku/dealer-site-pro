import { NextResponse } from 'next/server'
import { isPubliclyRoutableHost } from '@/lib/utils/ssrf-guard'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

function normalizeDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

async function probeHttps(domain: string): Promise<{
    status: 'active' | 'provisioning' | 'failed'
    message: string
    validUntil?: string
}> {
    const publicHost = await isPubliclyRoutableHost(domain)
    if (!publicHost) {
        return {
            status: 'failed',
            message: 'Domain does not resolve to a public host.',
        }
    }

    return new Promise((resolve) => {
        void import('tls').then((tls) => {
            const socket = tls.connect({
                host: domain,
                port: 443,
                servername: domain,
                rejectUnauthorized: false,
                timeout: 8000,
            })

            socket.once('secureConnect', () => {
                const certificate = socket.getPeerCertificate()
                const validUntil = certificate?.valid_to ? new Date(certificate.valid_to) : null
                const expired = validUntil ? validUntil.getTime() <= Date.now() : false

                socket.end()

                if (socket.authorized && !expired) {
                    resolve({
                        status: 'active',
                        message: 'HTTPS is active for this domain.',
                        validUntil: validUntil?.toISOString(),
                    })
                    return
                }

                resolve({
                    status: expired ? 'failed' : 'provisioning',
                    message: expired
                        ? 'The HTTPS certificate is expired.'
                        : 'SSL is still provisioning or the certificate is not trusted yet.',
                    validUntil: validUntil?.toISOString(),
                })
            })

            socket.once('timeout', () => {
                socket.destroy()
                resolve({
                    status: 'provisioning',
                    message: 'HTTPS did not respond yet. SSL may still be provisioning.',
                })
            })

            socket.once('error', () => {
                resolve({
                    status: 'provisioning',
                    message: 'HTTPS is not reachable yet. SSL may still be provisioning.',
                })
            })
        }).catch(() => {
            resolve({
                status: 'failed',
                message: 'Could not start SSL check.',
            })
        })
    })
}

export async function POST(request: Request) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { domainId, domain, dealerId } = body

        if (!domainId || !domain || !dealerId) {
            return NextResponse.json(
                { success: false, error: 'Domain ID, domain name and dealer ID are required' },
                { status: 400 }
            )
        }

        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        const { data: storedDomain, error: domainError } = await supabase
            .from('dealer_domains')
            .select('id, dealer_id, custom_domain, subdomain_url, subdomain, status, dns_verified')
            .eq('id', domainId)
            .eq('dealer_id', dealerId)
            .single()

        if (domainError || !storedDomain) {
            return NextResponse.json(
                { success: false, error: 'Domain not found or does not belong to your account' },
                { status: 404 }
            )
        }

        const storedDomainName = normalizeDomain(
            storedDomain.custom_domain ?? storedDomain.subdomain_url ?? storedDomain.subdomain ?? ''
        )

        if (!storedDomainName || normalizeDomain(domain) !== storedDomainName) {
            return NextResponse.json(
                { success: false, error: 'Domain name does not match the stored domain record' },
                { status: 400 }
            )
        }

        if (storedDomain.status !== 'active' || !storedDomain.dns_verified) {
            await supabase
                .from('dealer_domains')
                .update({
                    ssl_status: 'pending',
                    last_checked_at: new Date().toISOString(),
                })
                .eq('id', domainId)
                .eq('dealer_id', dealerId)

            return NextResponse.json({
                success: true,
                sslStatus: 'pending',
                message: 'DNS is still pending. Verify DNS before checking SSL.',
            })
        }

        const ssl = await probeHttps(storedDomainName)
        const updatePayload = {
            ssl_status: ssl.status,
            ssl_provisioned_at: ssl.status === 'active' ? new Date().toISOString() : null,
            ssl_expires_at: ssl.validUntil ?? null,
            last_checked_at: new Date().toISOString(),
        }

        const { error: updateError } = await supabase
            .from('dealer_domains')
            .update(updatePayload)
            .eq('id', domainId)
            .eq('dealer_id', dealerId)

        if (updateError) {
            console.error('[check-ssl] Failed to update SSL status:', updateError)
        }

        return NextResponse.json({
            success: true,
            sslStatus: ssl.status,
            message: ssl.message,
            validUntil: ssl.validUntil,
        })
    } catch (error) {
        console.error('Error in POST /api/domains/check-ssl:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
