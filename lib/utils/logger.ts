/**
 * Structured logger — wired to Sentry in production.
 *
 * logger.log   → dev-only console output
 * logger.warn  → console + Sentry warning message in production
 * logger.error → console + Sentry captureException in production
 */

import * as Sentry from '@sentry/nextjs'

const isProd = process.env.NODE_ENV === 'production'

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
        if (isProd) {
            Sentry.captureMessage(args.map(String).join(' '), 'warning')
        }
    },

    error: (...args: unknown[]) => {
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
