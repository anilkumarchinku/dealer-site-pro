/**
 * GET /api/domain/propagation-status/[id]
 * Check DNS propagation for a domain onboarding.
 */

import dns from 'dns/promises'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { DomainVerificationService } from '@/lib/services/domain-verification'
import { requireAuth } from '@/lib/supabase-server'
import type { Json } from '@/lib/database.types'

const EXPECTED_A_RECORD = '76.76.21.21'

type VerificationData = {
    token?: string | null
    method?: string | null
}

type ConfigurationData = {
    deployment_route?: 'full_domain' | 'subdomain' | null
    route?: 'full_domain' | 'subdomain' | null
    subdomain?: string | null
    subdomain_name?: string | null
}

type PropagationRecord = {
    propagated: boolean
    current_values?: string[]
}

function asObject<T>(value: Json | null): Partial<T> {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value as Partial<T>
        : {}
}

function normalizeDomain(domain: string): string {
    return domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

async function checkARecord(domain: string): Promise<PropagationRecord> {
    try {
        const values = await dns.resolve4(domain)
        return {
            propagated: values.includes(EXPECTED_A_RECORD),
            current_values: values,
        }
    } catch {
        return {
            propagated: false,
            current_values: [],
        }
    }
}

async function checkCnameRecord(domain: string, expectedValue: string): Promise<PropagationRecord> {
    try {
        const values = await dns.resolveCname(domain)
        return {
            propagated: values.some(value => value.replace(/\.$/, '') === expectedValue.replace(/\.$/, '')),
            current_values: values,
        }
    } catch {
        return {
            propagated: false,
            current_values: [],
        }
    }
}

function estimateRemaining(percentage: number): string {
    if (percentage >= 100) return '0 minutes'
    if (percentage >= 67) return '5-10 minutes'
    if (percentage >= 34) return '10-20 minutes'
    return '20-30 minutes'
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const { id: onboardingId } = await params
        if (!onboardingId) {
            return NextResponse.json(
                { success: false, error: 'Missing onboarding ID' },
                { status: 400 }
            )
        }

        const { data: onboarding, error: fetchError } = await supabase
            .from('domain_onboardings')
            .select('id, domain_name, verification, configuration')
            .eq('id', onboardingId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !onboarding) {
            return NextResponse.json(
                { success: false, error: 'Onboarding record not found' },
                { status: 404 }
            )
        }

        const domain = normalizeDomain(onboarding.domain_name)
        const verification = asObject<VerificationData>(onboarding.verification)
        const configuration = asObject<ConfigurationData>(onboarding.configuration)
        const route = configuration.deployment_route ?? configuration.route ?? 'full_domain'
        const subdomainName = configuration.subdomain ?? configuration.subdomain_name ?? 'shop'
        const targetDomain = route === 'subdomain' ? `${subdomainName}.${domain}` : domain

        const txtPromise = verification.token
            ? DomainVerificationService.verifyDNSTXT(domain, verification.token)
            : Promise.resolve({
                verified: false,
                found_records: [] as string[],
                error: 'Verification token is missing.',
            })

        const [aRecord, cnameRecord, txtResult] = await Promise.all([
            route === 'subdomain'
                ? checkCnameRecord(targetDomain, env.cnameTarget)
                : checkARecord(targetDomain),
            route === 'full_domain'
                ? checkCnameRecord(`www.${domain}`, env.cnameTarget)
                : Promise.resolve<PropagationRecord | null>(null),
            txtPromise,
        ])

        const records: {
            a_record: PropagationRecord
            www_record?: PropagationRecord
            txt_record: PropagationRecord
        } = {
            a_record: aRecord,
            ...(cnameRecord ? { www_record: cnameRecord } : {}),
            txt_record: {
                propagated: txtResult.verified,
                current_values: txtResult.found_records ?? [],
            },
        }

        const recordChecks = [records.a_record, records.txt_record, records.www_record].filter(
            (record): record is PropagationRecord => !!record
        )
        const checksPassed = recordChecks.filter(record => record.propagated).length
        const totalChecks = recordChecks.length
        const percentage = totalChecks > 0 ? Math.round((checksPassed / totalChecks) * 100) : 0

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
            target_domain: targetDomain,
            propagation_status: {
                overall: {
                    fully_propagated: checksPassed === totalChecks,
                    checks_passed: checksPassed,
                    total_checks: totalChecks,
                    percentage,
                },
                records,
                estimated_time_remaining: estimateRemaining(percentage),
            },
        })
    } catch (error) {
        console.error('Error checking DNS propagation status:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to check DNS propagation' },
            { status: 500 }
        )
    }
}
