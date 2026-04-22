interface PrivacyContentProps {
    dealerName: string
    location: string
    email: string
    phone: string
}

export function PrivacyContent({ dealerName, location, email, phone }: PrivacyContentProps) {
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    return (
        <div className="prose prose-gray max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-600 mb-8">Last updated: {today}</p>

            <p className="text-gray-600 mb-6">
                {dealerName} (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your personal information
                when you interact with us through our website or showroom.
            </p>

            <Section title="1. Information We Collect">
                <p>We may collect the following personal information:</p>
                <ul>
                    <li><strong>Contact information:</strong> Name, phone number, email address, and postal address.</li>
                    <li><strong>Vehicle preferences:</strong> The type, model, and brand of vehicle you are interested in.</li>
                    <li><strong>Financial information:</strong> Income details if you apply for financing (shared directly with partner lenders).</li>
                    <li><strong>Identity documents:</strong> Driving licence and government ID for test rides.</li>
                    <li><strong>Usage data:</strong> Browser type, IP address, and pages visited on our website (collected automatically).</li>
                </ul>
            </Section>

            <Section title="2. How We Use Your Information">
                <p>We use your information to:</p>
                <ul>
                    <li>Respond to your enquiries and schedule test rides.</li>
                    <li>Process bookings and purchases.</li>
                    <li>Arrange financing or insurance on your behalf (with your consent).</li>
                    <li>Send you offers, promotions, and updates about our products and services (only if you opt in).</li>
                    <li>Improve our website and customer experience.</li>
                    <li>Comply with applicable laws and regulations.</li>
                </ul>
            </Section>

            <Section title="3. Sharing Your Information">
                <p>We do not sell your personal information. We may share it only in the following cases:</p>
                <ul>
                    <li><strong>Partner lenders/insurers:</strong> To process your financing or insurance application, with your consent.</li>
                    <li><strong>Vehicle manufacturers:</strong> For warranty registration and service records.</li>
                    <li><strong>Legal requirements:</strong> When required by law, court order, or government authority.</li>
                    <li><strong>Business transfer:</strong> In the event of a merger or acquisition, your data may be transferred to the successor entity.</li>
                </ul>
            </Section>

            <Section title="4. Data Retention">
                <p>
                    We retain your personal information only as long as necessary to fulfil the purposes described
                    in this policy or as required by applicable law (typically 7 years for financial transaction records
                    as per Indian regulations).
                </p>
            </Section>

            <Section title="5. Cookies">
                <p>
                    Our website may use cookies to enhance your browsing experience. Cookies help us understand how
                    visitors use our site. You may disable cookies in your browser settings; however, some features
                    may not function correctly.
                </p>
            </Section>

            <Section title="6. Your Rights">
                <p>You have the right to:</p>
                <ul>
                    <li>Access the personal information we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your data (subject to legal retention requirements).</li>
                    <li>Opt out of marketing communications at any time.</li>
                </ul>
                <p>To exercise these rights, please contact us using the details below.</p>
            </Section>

            <Section title="7. Security">
                <p>
                    We take reasonable technical and organisational measures to protect your information from
                    unauthorised access, disclosure, or loss. However, no method of transmission over the internet
                    is 100% secure, and we cannot guarantee absolute security.
                </p>
            </Section>

            <Section title="8. Third-Party Links">
                <p>
                    Our website may contain links to third-party websites. We are not responsible for the privacy
                    practices or content of those sites. We encourage you to review their privacy policies.
                </p>
            </Section>

            <Section title="9. Changes to This Policy">
                <p>
                    We may update this Privacy Policy from time to time. The updated version will be posted on
                    our website with a revised date. Continued use of our services after any changes constitutes
                    acceptance of the updated policy.
                </p>
            </Section>

            <Section title="10. Contact Us">
                <p>For privacy-related queries or to exercise your rights, contact us:</p>
                <ul>
                    <li><strong>Dealership:</strong> {dealerName}</li>
                    <li><strong>Location:</strong> {location}</li>
                    <li><strong>Phone:</strong> <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a></li>
                    <li><strong>Email:</strong> <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a></li>
                </ul>
            </Section>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
            <div className="text-gray-600 space-y-2">{children}</div>
        </div>
    )
}
