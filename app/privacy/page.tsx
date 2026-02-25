import Link from "next/link"

export const metadata = {
    title: "Privacy Policy | DealerSite Pro",
    description: "Privacy Policy for DealerSite Pro — how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← Back to Home</Link>

                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p className="text-muted-foreground">
                            When you register for DealerSite Pro, we collect your name, email address, phone number,
                            and dealership information. We also collect usage data to improve our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground">
                            We use your information to provide and maintain our services, send you important updates,
                            and improve user experience. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
                        <p className="text-muted-foreground">
                            Your data is stored securely using industry-standard encryption. API keys are stored
                            server-side and are never exposed to browsers. We use Supabase for secure data storage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
                        <p className="text-muted-foreground">
                            We use third-party services including Vercel (hosting), Supabase (database),
                            and Resend (email delivery). Each service has its own privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                        <p className="text-muted-foreground">
                            You can request access to, correction of, or deletion of your personal data at any time
                            by contacting us. You can also export your data from the dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                        <p className="text-muted-foreground">
                            For privacy-related questions, email us at{" "}
                            <a href="mailto:privacy@dealersitepro.com" className="text-blue-600 hover:underline">
                                privacy@dealersitepro.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
