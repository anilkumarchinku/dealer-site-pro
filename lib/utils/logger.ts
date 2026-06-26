/**
 * Structured logger — wired to Sentry in production.
 *
 * logger.log   → dev-only console output
 * logger.warn  → console + Sentry warning message in production
 * logger.error → console + Sentry captureException in production
 */

const isProd = process.env.NODE_ENV === 'production'
const importRuntimeModule = new Function(
    'specifier',
    'return import(specifier)'
) as (specifier: string) => Promise<typeof import('@sentry/nextjs')>

function reportToSentry(
    kind: 'message' | 'exception',
    payload: string | Error,
    level?: 'warning' | 'error'
) {
    if (!isProd) return

    void importRuntimeModule('@sentry/nextjs')
        .then((Sentry) => {
            if (kind === 'exception' && payload instanceof Error) {
                Sentry.captureException(payload)
                return
            }

            Sentry.captureMessage(String(payload), level)
        })
        .catch(() => {
            // Logging must never break a public page render.
        })
}

function toError(args: unknown[]): Error | undefined {
    const last = args[args.length - 1]
    if (last instanceof Error) return last
    return undefined
}

export const logger = {
    log: (...args: unknown[]) => {
        if (!isProd) console.log(...args) // eslint-disable-line no-console
    },

    warn: (...args: unknown[]) => {
        console.warn(...args) // eslint-disable-line no-console
        reportToSentry('message', args.map(String).join(' '), 'warning')
    },

    error: (...args: unknown[]) => {
        console.error(...args) // eslint-disable-line no-console
        const err = toError(args)
        reportToSentry(
            err ? 'exception' : 'message',
            err ?? args.map(String).join(' '),
            'error'
        )
    },
}
