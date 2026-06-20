'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
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
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again, and contact support if the
          problem persists.
        </p>
        {error.digest && (
          <p className="mt-4 text-sm text-muted-foreground">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <Button onClick={() => reset()} className="mt-6">
          Try again
        </Button>
      </div>
    </main>
  );
}
