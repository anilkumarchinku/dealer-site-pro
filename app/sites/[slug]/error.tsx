'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full border border-border rounded-xl p-8 bg-muted/30">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to load site</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        {error.digest && (
          <p className="text-sm text-muted-foreground/60 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="space-y-2">
          <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="block w-full text-center bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 px-4 rounded-xl transition-colors mt-2"
          >
            Go home
          </a>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
        </p>
      </div>
    </div>
  );
}
