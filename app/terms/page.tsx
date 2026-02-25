import Link from "next/link"

export const metadata = {
    title: "Terms of Service | DealerSite Pro",
    description: "Terms of Service for DealerSite Pro — rules and conditions for using our platform.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← Back to Home</Link>

                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By creating an account on DealerSite Pro, you agree to these Terms of Service.
                            If you do not agree, please do not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
                        <p className="text-muted-foreground">
                            DealerSite Pro provides car dealerships with website creation, hosting, and management tools.
                            We offer free and paid plans with varying features.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
                        <p className="text-muted-foreground">
                            You are responsible for maintaining the security of your account credentials
                            and for all activities that occur under your account. You must provide accurate
                            dealership information during registration.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                        <p className="text-muted-foreground">
                            You agree to use DealerSite Pro only for lawful purposes related to automotive
                            dealership operations. You may not use our platform for fraudulent listings
                            or misleading content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            DealerSite Pro templates, branding, and software are our intellectual property.
                            Content you upload (logos, vehicle images, descriptions) remains yours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Free Subdomains</h2>
                        <p className="text-muted-foreground">
                            Free subdomains (e.g., yourdealer.indrav.in) are provided at no cost.
                            We reserve the right to reclaim inactive subdomains after 90 days of inactivity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            DealerSite Pro is provided &quot;as is&quot; without warranties. We are not liable
                            for any indirect, incidental, or consequential damages arising from your use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                        <p className="text-muted-foreground">
                            For questions about these terms, email us at{" "}
                            <a href="mailto:legal@dealersitepro.com" className="text-blue-600 hover:underline">
                                legal@dealersitepro.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
