import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
                <div
                    className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
                    aria-hidden="true"
                >
                    <Compass className="h-7 w-7" />
                </div>
                <p className="text-5xl font-black tracking-tight text-foreground">404</p>
                <h1 className="mt-3 text-xl font-bold text-foreground">Page not found</h1>
                <p className="mt-2 text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or may have moved.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    Go home
                </Link>
            </div>
        </main>
    );
}
