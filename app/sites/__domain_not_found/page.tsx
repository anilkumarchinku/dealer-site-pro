export default function DomainNotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">Domain Not Found</h1>
                <p className="text-muted-foreground mb-2">
                    This domain isn&apos;t connected to any dealership yet.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                    If you&apos;re a dealer, make sure your domain DNS is pointed correctly and your domain is verified in your dashboard.
                </p>
                <a
                    href="https://dealersitepro.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-colors"
                >
                    Learn about DealerSite Pro
                </a>
                <p className="text-xs text-muted-foreground mt-8">
                    Powered by <span className="text-blue-500 font-semibold">DealerSite Pro</span>
                </p>
            </div>
        </div>
    )
}
