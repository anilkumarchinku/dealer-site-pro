import { createAdminClient } from '@/lib/supabase-server'
import { toJsonValue } from '@/lib/utils/json-value'

export type DomainDeploymentOperationType =
    | 'custom_domain_connect'
    | 'custom_domain_remove'
    | 'multi_tenant_deploy'

export type DomainDeploymentOperationStatus =
    | 'started'
    | 'provider_pending'
    | 'provider_succeeded'
    | 'provider_failed'
    | 'completed'
    | 'failed'

export type DomainDeploymentProviderStep =
    | 'database'
    | 'vercel'
    | 'dns'
    | 'deployment'

export type DomainDeploymentOperationEvent = {
    dealerId?: string | null
    domainId?: string | null
    domain?: string | null
    operation: DomainDeploymentOperationType
    status: DomainDeploymentOperationStatus
    providerStep: DomainDeploymentProviderStep
    details?: Record<string, unknown> | null
    error?: unknown
}

export async function recordDomainDeploymentOperation(event: DomainDeploymentOperationEvent): Promise<void> {
    try {
        const admin = createAdminClient()
        await admin
            .from('domain_deployment_operation_events')
            .insert({
                dealer_id: event.dealerId ?? null,
                domain_id: event.domainId ?? null,
                domain: event.domain ?? null,
                operation: event.operation,
                status: event.status,
                provider_step: event.providerStep,
                details: toJsonValue(event.details),
                error_message: event.error instanceof Error
                    ? event.error.message
                    : event.error
                        ? String(event.error)
                        : null,
            })
    } catch (error) {
        console.warn('[DomainOperation] Failed to record operation event:', error)
    }
}
