export type ExternalApiResponseType = 'json' | 'text' | 'void'

export class ExternalApiError extends Error {
    constructor(
        message: string,
        public readonly providerName: string,
        public readonly path: string,
        public readonly status?: number,
        public readonly bodyText?: string,
        public readonly bodyJson?: unknown
    ) {
        super(message)
        this.name = 'ExternalApiError'
    }
}

type ExternalApiFetchOptions = {
    baseUrl: string
    providerName: string
    path: string
    headers: HeadersInit
    init?: RequestInit
    timeoutMs?: number
    responseType?: ExternalApiResponseType
}

async function readBody(res: Response): Promise<{ text: string; json?: unknown }> {
    const text = await res.text()
    if (!text) return { text }

    try {
        return { text, json: JSON.parse(text) }
    } catch {
        return { text }
    }
}

function errorMessageWithCause(error: unknown): string {
    if (!(error instanceof Error)) return String(error)

    const cause = (error as Error & { cause?: unknown }).cause
    if (!cause) return error.message

    if (cause instanceof Error) {
        return `${error.message}: ${cause.message}`
    }

    return `${error.message}: ${String(cause)}`
}

export async function externalApiFetch<T = unknown>({
    baseUrl,
    providerName,
    path,
    headers,
    init,
    timeoutMs = 30_000,
    responseType = 'json',
}: ExternalApiFetchOptions): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            ...init,
            headers,
            signal: controller.signal,
        })

        if (!res.ok) {
            const body = await readBody(res)
            throw new ExternalApiError(
                `${providerName} API ${path} -> ${res.status}: ${body.text}`,
                providerName,
                path,
                res.status,
                body.text,
                body.json
            )
        }

        if (responseType === 'void' || res.status === 204) {
            return undefined as T
        }

        if (responseType === 'text') {
            return await res.text() as T
        }

        return await res.json() as T
    } catch (err) {
        if ((err as Error).name === 'AbortError') {
            throw new ExternalApiError(
                `${providerName} API ${path} timed out after ${timeoutMs / 1000}s`,
                providerName,
                path
            )
        }
        if (err instanceof ExternalApiError) {
            throw err
        }
        throw new ExternalApiError(
            `${providerName} API ${path} network error: ${errorMessageWithCause(err)}`,
            providerName,
            path
        )
    } finally {
        clearTimeout(timeout)
    }
}
