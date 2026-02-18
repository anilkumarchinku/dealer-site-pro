/**
 * vercel-service.ts
 * Wraps the Vercel REST API for dealer site deployments.
 *
 * Required env vars:
 *   VERCEL_TOKEN       — Vercel API token (Account Settings → Tokens)
 *   VERCEL_TEAM_ID     — Team ID (optional; leave empty for personal account)
 *   VERCEL_BASE_DOMAIN — Base domain for dealer sites (e.g. "dealersitepro.app")
 *   GITHUB_ORG         — GitHub org/user (same as in github-service)
 */

const BASE = 'https://api.vercel.com'

function teamQuery() {
    const teamId = process.env.VERCEL_TEAM_ID
    return teamId ? `?teamId=${teamId}` : ''
}

function headers() {
    const token = process.env.VERCEL_TOKEN
    if (!token) throw new Error('VERCEL_TOKEN env var is not set')
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

async function vFetch(path: string, init?: RequestInit) {
    const res = await fetch(`${BASE}${path}`, { ...init, headers: headers() })
    if (!res.ok) {
        const body = await res.text()
        throw new Error(`Vercel API ${path} → ${res.status}: ${body}`)
    }
    return res.json()
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VercelProject {
    id: string
    name: string
    link?: {
        repoId: number
        repoOwnerId?: string
        type: string
    }
}

export interface VercelDeployment {
    id: string
    uid: string
    url: string
    state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
    readyState?: string
    inspectorUrl?: string
}

export interface VercelDomain {
    name: string
    verified: boolean
    configured: boolean
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Create a Vercel project linked to the dealer's GitHub repo.
 * Idempotent — returns existing project if one with that name exists.
 */
export async function createVercelProject(
    dealerSlug: string,
    githubRepoFullName: string,  // e.g. "dealersitepro/dealer-kumarmotors"
): Promise<VercelProject> {
    const q = teamQuery()

    try {
        // Check if project already exists
        const existing = await vFetch(`/v9/projects/dealer-${dealerSlug}${q}`)
        return existing as VercelProject
    } catch {
        // Not found — create it
    }

    const org = process.env.GITHUB_ORG
    if (!org) throw new Error('GITHUB_ORG env var is not set')

    const data = await vFetch(`/v10/projects${q}`, {
        method: 'POST',
        body: JSON.stringify({
            name:      `dealer-${dealerSlug}`,
            framework: 'nextjs',
            gitRepository: {
                type: 'github',
                repo: githubRepoFullName,
            },
            buildCommand:    null,   // use framework default
            outputDirectory: null,
            installCommand:  null,
            devCommand:      null,
        }),
    })

    return data as VercelProject
}

/**
 * Set environment variables on a Vercel project.
 * Typically the NEXT_PUBLIC_SUPABASE_* vars so the deployed site can read DB.
 */
export async function setProjectEnvVars(
    dealerSlug: string,
    envVars: Record<string, string>,
): Promise<void> {
    const q         = teamQuery()
    const projectId = `dealer-${dealerSlug}`
    const targets   = ['production', 'preview', 'development'] as const

    const body = Object.entries(envVars).map(([key, value]) => ({
        key,
        value,
        type:   'encrypted',
        target: targets,
    }))

    await vFetch(`/v10/projects/${projectId}/env${q}`, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

/**
 * Trigger a new Vercel deployment for the dealer's project.
 * Vercel auto-deploys on push, but this lets us force one immediately.
 */
export async function triggerDeployment(dealerSlug: string): Promise<VercelDeployment> {
    const q    = teamQuery()
    const org  = process.env.GITHUB_ORG
    if (!org) throw new Error('GITHUB_ORG env var is not set')

    const data = await vFetch(`/v13/deployments${q}`, {
        method: 'POST',
        body: JSON.stringify({
            name:   `dealer-${dealerSlug}`,
            gitSource: {
                type:   'github',
                org,
                repo:   `dealer-${dealerSlug}`,
                ref:    'main',
            },
            projectSettings: {
                framework: 'nextjs',
            },
        }),
    })

    return data as VercelDeployment
}

/**
 * Get the latest deployment state for a dealer project.
 */
export async function getDeploymentStatus(deploymentId: string): Promise<VercelDeployment> {
    const q    = teamQuery()
    const data = await vFetch(`/v13/deployments/${deploymentId}${q}`)
    return data as VercelDeployment
}

/**
 * Add a custom domain (subdomain) to the dealer's Vercel project.
 * e.g. "kumarmotors.dealersitepro.app"
 */
export async function addDomainToProject(
    dealerSlug: string,
    domain: string,
): Promise<VercelDomain> {
    const q         = teamQuery()
    const projectId = `dealer-${dealerSlug}`

    const data = await vFetch(`/v10/projects/${projectId}/domains${q}`, {
        method: 'POST',
        body: JSON.stringify({ name: domain }),
    })

    return data as VercelDomain
}

/**
 * Remove a custom domain from a Vercel project.
 */
export async function removeDomainFromProject(
    dealerSlug: string,
    domain: string,
): Promise<void> {
    const q         = teamQuery()
    const projectId = `dealer-${dealerSlug}`

    await vFetch(`/v10/projects/${projectId}/domains/${domain}${q}`, {
        method: 'DELETE',
    })
}

/**
 * Get a list of all recent deployments for a dealer project.
 */
export async function listDeployments(dealerSlug: string): Promise<VercelDeployment[]> {
    const q    = teamQuery()
    const data = await vFetch(`/v6/deployments${q}&projectId=dealer-${dealerSlug}&limit=5`)
    return (data as { deployments: VercelDeployment[] }).deployments ?? []
}

/**
 * Delete a Vercel project (when a dealer account is removed).
 */
export async function deleteProject(dealerSlug: string): Promise<void> {
    const q = teamQuery()
    await vFetch(`/v9/projects/dealer-${dealerSlug}${q}`, { method: 'DELETE' })
}

// ── Main-project multi-tenant domain functions ─────────────────────────────

/**
 * Register a custom domain on the main DealerSite Pro Vercel project.
 * All dealer custom domains are added here — not to per-dealer projects.
 * Requires: VERCEL_MAIN_PROJECT_ID env var (your main project name or ID)
 */
export async function registerDomainOnMainProject(domain: string): Promise<VercelDomain> {
    const q          = teamQuery()
    const projectId  = process.env.VERCEL_MAIN_PROJECT_ID
    if (!projectId) throw new Error('VERCEL_MAIN_PROJECT_ID env var is not set')

    const data = await vFetch(`/v10/projects/${projectId}/domains${q}`, {
        method: 'POST',
        body:   JSON.stringify({ name: domain }),
    })

    return data as VercelDomain
}

/**
 * Remove a custom domain from the main project (when dealer disconnects their domain).
 */
export async function removeDomainFromMainProject(domain: string): Promise<void> {
    const q         = teamQuery()
    const projectId = process.env.VERCEL_MAIN_PROJECT_ID
    if (!projectId) throw new Error('VERCEL_MAIN_PROJECT_ID env var is not set')

    await vFetch(`/v10/projects/${projectId}/domains/${encodeURIComponent(domain)}${q}`, {
        method: 'DELETE',
    })
}

/**
 * Get Vercel's verification requirements for a custom domain.
 * Returns the CNAME/A record the dealer must set in their DNS.
 */
export async function getDomainVerification(domain: string): Promise<{
    verified:     boolean
    cname:        string
    verification: { type: string; domain: string; value: string }[]
}> {
    const q         = teamQuery()
    const projectId = process.env.VERCEL_MAIN_PROJECT_ID
    if (!projectId) throw new Error('VERCEL_MAIN_PROJECT_ID env var is not set')

    const data = await vFetch(`/v10/projects/${projectId}/domains/${encodeURIComponent(domain)}${q}`)
    return {
        verified:     (data as { verified: boolean }).verified ?? false,
        cname:        'cname.vercel-dns.com',
        verification: (data as { verification?: { type: string; domain: string; value: string }[] }).verification ?? [],
    }
}
