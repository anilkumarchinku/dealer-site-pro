/**
 * Structured logger for production use.
 * - Drops console.log entirely in production (use console.error/warn for real issues)
 * - In production: console.error and console.warn only
 * - In development: all levels pass through
 *
 * When Sentry is integrated (Task 4.1), add captureException here.
 */

const isProd = process.env.NODE_ENV === 'production'

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
  log: (...args: any[]) => {
    if (!isProd) console.log(...args) // eslint-disable-line no-console
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (...args: any[]) => {
    console.warn(...args)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => {
    console.error(...args)
  },
}
