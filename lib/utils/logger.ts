/**
 * Structured logger — wired to Sentry in production.
 *
 * logger.log   → dev-only console output
 * logger.warn  → console + Sentry warning message in production
 * logger.error → console + Sentry captureException in production
 */

import * as Sentry from '@sentry/nextjs'

const isProd = process.env.NODE_ENV === 'production'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toError(args: any[]): Error | undefined {
    const last = args[args.length - 1]
    if (last instanceof Error) return last
    return undefined
}

export const logger = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (...args: any[]) => {
        if (!isProd) console.log(...args) // eslint-disable-line no-console
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (...args: any[]) => {
        console.warn(...args) // eslint-disable-line no-console
        if (isProd) {
            Sentry.captureMessage(args.map(String).join(' '), 'warning')
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (...args: any[]) => {
        console.error(...args) // eslint-disable-line no-console
        if (isProd) {
            const err = toError(args)
            if (err) {
                Sentry.captureException(err)
            } else {
                Sentry.captureMessage(args.map(String).join(' '), 'error')
            }
        }
    },
}
