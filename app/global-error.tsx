'use client';

/**
 * Global error boundary — catches errors thrown in the root layout itself.
 * Must render its own <html>/<body> because it replaces the root layout.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: 32, textAlign: 'center' }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Something went wrong</h2>
                        <p style={{ color: '#4b5563', marginBottom: 24 }}>
                            An unexpected error occurred. Please try again.
                        </p>
                        {error.digest && (
                            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>Error ID: {error.digest}</p>
                        )}
                        <button
                            onClick={() => reset()}
                            style={{ background: '#2563eb', color: '#fff', fontWeight: 600, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
