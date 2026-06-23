'use client';

import { useEffect } from 'react';

/**
 * Global error boundary — catches errors thrown in the root layout itself.
 * It REPLACES the root layout, so it must render its own <html>/<body> and
 * cannot rely on the app's Tailwind/CSS tokens being applied. Styling is kept
 * self-contained (inline + a scoped <style> block) while visually matching the
 * other error/empty screens, including dark mode via prefers-color-scheme.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the real error for diagnostics; never surface it to the user.
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <style>{`
                    .dsp-globalerror {
                        --bg: #ffffff;
                        --card: #ffffff;
                        --border: #e5e9f0;
                        --fg: #111827;
                        --muted: #6b7280;
                        --primary: #111827;
                        --primary-fg: #ffffff;
                        --accent: rgba(17, 24, 39, 0.08);
                    }
                    @media (prefers-color-scheme: dark) {
                        .dsp-globalerror {
                            --bg: #0f172a;
                            --card: #1e293b;
                            --border: #334155;
                            --fg: #f8fafc;
                            --muted: #94a3b8;
                            --primary: #3b82f6;
                            --primary-fg: #ffffff;
                            --accent: rgba(59, 130, 246, 0.16);
                        }
                    }
                    .dsp-globalerror__btn:hover { opacity: 0.9; }
                    .dsp-globalerror__btn:focus-visible {
                        outline: 2px solid var(--primary);
                        outline-offset: 2px;
                    }
                `}</style>
                <div
                    className="dsp-globalerror"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        background: 'var(--bg)',
                        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
                    }}
                >
                    <div
                        style={{
                            maxWidth: 420,
                            width: '100%',
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 16,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            padding: 32,
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            aria-hidden="true"
                            style={{
                                margin: '0 auto 24px',
                                width: 56,
                                height: 56,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '9999px',
                                background: 'var(--accent)',
                                color: 'var(--primary)',
                            }}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 0 }}>
                            An unexpected error occurred. Please try again, and contact support if the
                            problem persists.
                        </p>
                        {error.digest && (
                            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16, marginBottom: 0 }}>
                                Reference:{' '}
                                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                                    {error.digest}
                                </span>
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="dsp-globalerror__btn"
                            style={{
                                marginTop: 24,
                                background: 'var(--primary)',
                                color: 'var(--primary-fg)',
                                fontWeight: 600,
                                fontSize: 14,
                                padding: '10px 20px',
                                borderRadius: 12,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease',
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
