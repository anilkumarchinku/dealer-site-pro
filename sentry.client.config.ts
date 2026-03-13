import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Sample 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,
    // Replay 1% of sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      Sentry.replayIntegration(),
    ],
  })
}
