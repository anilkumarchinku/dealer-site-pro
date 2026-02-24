'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Site error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="text-lg text-muted-foreground">
          Something went wrong while loading this site.
        </p>
        <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="block w-full text-center bg-muted hover:bg-muted/80 text-foreground font-semibold py-2 px-4 rounded-xl transition-colors mt-2"
          >
            Go home
          </Link>
      </div>
    </div>
  );
}
