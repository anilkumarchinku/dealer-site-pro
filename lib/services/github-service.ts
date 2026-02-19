/**
 * github-service.ts
 * Wraps the GitHub REST API for dealer site deployments.
 *
 * Required env vars:
 *   GITHUB_TOKEN         — Personal Access Token or GitHub App token (repo scope)
 *   GITHUB_ORG           — GitHub org/user where dealer repos live (e.g. "dealersitepro")
 *   GITHUB_TEMPLATE_REPO — Name of the template repo (e.g. "dealer-site-template")
 */

import fs from 'fs'
import path from 'path'

const BASE = 'https://api.github.com'

function headers() {
    const token = process.env.GITHUB_TOKEN
    if (!token) throw new Error('GITHUB_TOKEN env var is not set')
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
    }
}

async function ghFetch(path: string, init?: RequestInit) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    try {
        const res = await fetch(`${BASE}${path}`, {
            ...init,
            headers: headers(),
            signal: controller.signal,
        })
        if (!res.ok) {
            const body = await res.text()
            throw new Error(`GitHub API ${path} → ${res.status}: ${body}`)
        }
        return res.json()
    } catch (err) {
        if ((err as Error).name === 'AbortError') {
            throw new Error(`GitHub API ${path} timed out after 30s`)
        }
        throw err
    } finally {
        clearTimeout(timeout)
    }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GitHubRepo {
    id: number
    name: string
    full_name: string
    html_url: string
    clone_url: string
    private: boolean
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Create a new repo from the dealer site template.
 * The template repo must have "Template repository" enabled on GitHub.
 */
export async function createRepoFromTemplate(dealerSlug: string): Promise<GitHubRepo> {
    const org = process.env.GITHUB_ORG
    const templateRepo = process.env.GITHUB_TEMPLATE_REPO
    if (!org || !templateRepo) {
        throw new Error('GITHUB_ORG and GITHUB_TEMPLATE_REPO env vars must be set')
    }

    const repoName = `dealer-${dealerSlug}`

    const data = await ghFetch(`/repos/${org}/${templateRepo}/generate`, {
        method: 'POST',
        body: JSON.stringify({
            owner: org,
            name: repoName,
            description: `Dealer site for ${dealerSlug}`,
            private: true,
            include_all_branches: false,
        }),
    })

    return data as GitHubRepo
}

/**
 * Check whether a repo already exists for the given dealer slug.
 * Returns the repo data or null.
 */
export async function getRepo(dealerSlug: string): Promise<GitHubRepo | null> {
    const org = process.env.GITHUB_ORG
    if (!org) throw new Error('GITHUB_ORG env var is not set')

    try {
        const data = await ghFetch(`/repos/${org}/dealer-${dealerSlug}`)
        return data as GitHubRepo
    } catch {
        return null
    }
}

/**
 * Get the current SHA of a file in the repo (needed for updates).
 * Returns null if the file doesn't exist yet.
 */
async function getFileSha(
    org: string,
    repoName: string,
    path: string,
): Promise<string | null> {
    try {
        const data = await ghFetch(`/repos/${org}/${repoName}/contents/${path}`)
        return (data as { sha: string }).sha
    } catch {
        return null
    }
}

/**
 * Create or update a file in the repo.
 * Uses GitHub's Contents API (base64-encodes the content).
 */
export async function upsertFile(
    dealerSlug: string,
    filePath: string,
    content: string | Buffer,
    commitMessage: string,
): Promise<void> {
    const org = process.env.GITHUB_ORG
    if (!org) throw new Error('GITHUB_ORG env var is not set')

    const repoName = `dealer-${dealerSlug}`
    const sha = await getFileSha(org, repoName, filePath)

    // Handle both string and Buffer content
    const encoded = Buffer.isBuffer(content)
        ? content.toString('base64')
        : Buffer.from(content, 'utf-8').toString('base64')

    await ghFetch(`/repos/${org}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: commitMessage,
            content: encoded,
            ...(sha ? { sha } : {}),
        }),
    })
}

/**
 * Push (create or update) the dealer config to the dealer's repo.
 * This is the single file that customises the template for each dealer.
 */
export async function pushDealerConfig(
    dealerSlug: string,
    configContent: string,
): Promise<void> {
    await upsertFile(
        dealerSlug,
        'dealer.config.ts',
        configContent,
        `chore: update dealer config [auto]`,
    )
}

/**
 * Delete a dealer repo (used when a dealer account is deleted).
 */
export async function deleteRepo(dealerSlug: string): Promise<void> {
    const org = process.env.GITHUB_ORG
    if (!org) throw new Error('GITHUB_ORG env var is not set')

    await ghFetch(`/repos/${org}/dealer-${dealerSlug}`, { method: 'DELETE' })
}

/**
 * Recursively syncs a local directory to the dealer's repo.
 * Ignores .git, node_modules, .next, .env, .DS_Store
 */
export async function syncDirectory(
    dealerSlug: string,
    localDir: string,
    baseDir: string = localDir
): Promise<void> {
    const entries = fs.readdirSync(localDir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(localDir, entry.name)
        const relPath = path.relative(baseDir, fullPath)

        // Ignored files/dirs
        if (
            entry.name === '.git' ||
            entry.name === 'node_modules' ||
            entry.name === '.next' ||
            entry.name.startsWith('.env') ||
            entry.name === '.DS_Store' ||
            entry.name === 'dealer.config.ts' || // Don't overwrite config with template default
            entry.name === 'README.md' ||
            entry.name === 'next-env.d.ts'
        ) {
            continue
        }

        if (entry.isDirectory()) {
            await syncDirectory(dealerSlug, fullPath, baseDir)
        } else {
            // Read as buffer to handle both text and binary (images)
            const content = fs.readFileSync(fullPath)

            try {
                // Determine content type or just let upsertFile handle base64
                await upsertFile(
                    dealerSlug,
                    relPath,
                    content,
                    `chore: sync ${relPath} [auto]`
                )
                console.log(`Synced ${relPath}`)
            } catch (err) {
                console.error(`Failed to sync ${relPath}:`, err)
            }
        }
    }
}
