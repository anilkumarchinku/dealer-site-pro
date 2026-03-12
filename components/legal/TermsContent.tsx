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
            <p className="text-sm text-gray-500 mb-8">Last updated: {today}</p>

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
                    <li>You are solely responsible for your safety and adherence to all traffic laws during a test ride.</li>
                    <li>{dealerName} will not be liable for any damage, accident, or injury occurring during a test ride.</li>
                </ul>
            </Section>

            <Section title="4. Bookings and Payments">
                <ul>
                    <li>Any booking amount paid is non-refundable unless the {vehicleWord} is unavailable or the dealership cancels the booking.</li>
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
                    To the fullest extent permitted by applicable law, {dealerName} shall not be liable for any indirect,
                    incidental, special, or consequential damages arising from the use of our services or {vehicleWord}s.
                    Our total liability shall not exceed the amount paid by you for the relevant transaction.
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
