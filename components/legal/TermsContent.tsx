interface TermsContentProps {
    dealerName: string
    location: string
    email: string
    phone: string
    vehicleWord: string  // 'vehicle' | 'two-wheeler' | 'three-wheeler'
}

export function TermsContent({ dealerName, location, email, phone, vehicleWord }: TermsContentProps) {
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    return (
        <div className="prose prose-gray max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-600 mb-8">Last updated: {today}</p>

            <div className="not-prose mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900 font-semibold mb-1">Template notice</p>
                <p className="text-sm text-amber-800">
                    These are general-purpose terms provided as a starting template only. They are not legal
                    advice and have not been tailored to {dealerName}&apos;s actual policies. Please review,
                    customise, and replace this text before relying on it.
                </p>
            </div>

            <p className="text-gray-600 mb-6">
                Welcome to <strong>{dealerName}</strong>, located in {location}. By visiting our showroom, using our website,
                or engaging our services, you agree to the following terms and conditions. Please read them carefully.
            </p>

            <Section title="1. Acceptance of Terms">
                <p>
                    By accessing our website or making an enquiry with {dealerName}, you accept and agree to be bound
                    by these Terms &amp; Conditions. If you do not agree, please do not use our services.
                </p>
            </Section>

            <Section title="2. Products and Services">
                <ul>
                    <li>We deal in new and/or used {vehicleWord}s. All products are subject to availability.</li>
                    <li>Prices displayed are indicative and subject to change without prior notice. Final pricing will be confirmed at the time of purchase.</li>
                    <li>All {vehicleWord} images on our website are for representation purposes only. Actual colour, features, and specifications may vary.</li>
                    <li>We are an authorised dealer for the brands we represent. We do not guarantee availability of specific models or variants.</li>
                </ul>
            </Section>

            <Section title="3. Test Ride / Test Drive">
                <ul>
                    <li>Test rides / test drives are subject to availability and dealership scheduling.</li>
                    <li>A valid driving licence and one additional government-issued photo ID are mandatory before a test ride.</li>
                    <li>You are expected to drive safely and to follow all applicable traffic laws during a test ride.</li>
                    <li>
                        Responsibility for damage, accident, or injury during a test ride will be determined in
                        accordance with applicable law and any separate test-ride agreement you sign.
                        <span className="block text-sm text-gray-500 mt-1">
                            [Dealer to set out the actual liability terms that apply to test rides.]
                        </span>
                    </li>
                </ul>
            </Section>

            <Section title="4. Bookings and Payments">
                <ul>
                    <li>
                        Booking and refund terms (including any amount payable and the conditions for a refund)
                        will be confirmed in writing at the time of booking.
                        <span className="block text-sm text-gray-500 mt-1">
                            [Dealer to specify the actual booking and refund policy.]
                        </span>
                    </li>
                    <li>Full payment or financing approval must be completed before {vehicleWord} delivery.</li>
                    <li>All prices are exclusive of applicable taxes, registration charges, insurance, and other statutory levies unless explicitly stated.</li>
                    <li>Finance and loan arrangements are subject to lender approval. {dealerName} does not guarantee financing approval.</li>
                </ul>
            </Section>

            <Section title="5. Exchange and Trade-In">
                <ul>
                    <li>Exchange valuations are provided as an estimate and are subject to a physical inspection of the {vehicleWord}.</li>
                    <li>The final exchange value may differ from the initial estimate based on the actual condition of the {vehicleWord}.</li>
                    <li>Ownership documents for the {vehicleWord} being exchanged must be clear and free from disputes.</li>
                </ul>
            </Section>

            <Section title="6. Warranty">
                <ul>
                    <li>New {vehicleWord}s come with the manufacturer's standard warranty as applicable in India.</li>
                    <li>Used {vehicleWord}s may or may not carry a warranty, as specified at the time of sale.</li>
                    <li>{dealerName} does not extend any additional warranty beyond what is provided by the manufacturer, unless explicitly stated in writing.</li>
                </ul>
            </Section>

            <Section title="7. Limitation of Liability">
                <p>
                    Our liability to you is limited to the extent permitted by applicable law. Nothing in these
                    terms excludes any liability that cannot lawfully be excluded.
                </p>
                <p className="text-sm text-gray-500">
                    [Dealer to set out any specific limitation of liability, reviewed against applicable law before
                    use. Avoid stating exclusions or caps that have not been confirmed and may not be enforceable.]
                </p>
            </Section>

            <Section title="8. Privacy">
                <p>
                    Your personal information is collected and used in accordance with our{' '}
                    <a href="privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    By using our services you consent to such collection and use.
                </p>
            </Section>

            <Section title="9. Governing Law">
                <p>
                    These Terms are governed by the laws of India. Any dispute arising out of or relating to these Terms
                    shall be subject to the exclusive jurisdiction of the courts in {location}.
                </p>
            </Section>

            <Section title="10. Contact Us">
                <p>If you have any questions about these Terms, please contact us:</p>
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
