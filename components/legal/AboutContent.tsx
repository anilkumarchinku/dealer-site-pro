interface AboutContentProps {
    dealerName: string
    tagline: string | null
    location: string
    fullAddress: string | null
    phone: string
    email: string
    brands: string[]
    services: string[] | null
    vehicleWord: string  // 'vehicles' | 'two-wheelers' | 'three-wheelers'
    vehicleEmoji: string // '🚗' | '🏍️' | '🛺'
}

export function AboutContent({
    dealerName,
    tagline,
    location,
    fullAddress,
    phone,
    email,
    brands,
    services,
    vehicleWord,
    vehicleEmoji,
}: AboutContentProps) {
    const displayServices = services?.filter(Boolean) ?? []
    const displayBrands = brands.filter(Boolean)

    return (
        <div className="space-y-10">
            {/* Hero */}
            <div className="text-center py-8 border-b border-gray-200">
                <div className="text-5xl mb-4">{vehicleEmoji}</div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{dealerName}</h1>
                {tagline && <p className="text-lg text-gray-600 italic">&ldquo;{tagline}&rdquo;</p>}
                <p className="text-gray-600 mt-2 flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                </p>
            </div>

            {/* Who We Are */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
                <p className="text-gray-600 leading-relaxed">
                    {dealerName} is a trusted {vehicleWord} dealership based in {location}.
                    We are dedicated to helping our customers find the perfect {vehicleWord} — whether they are
                    looking for a brand-new model or a quality pre-owned one. Our team is committed to
                    transparency, honest pricing, and an exceptional customer experience from the moment
                    you walk into our showroom.
                </p>
            </div>

            {/* What We Stand For */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Stand For</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    <ValueCard
                        icon="🤝"
                        title="Trust &amp; Transparency"
                        desc="Clear pricing, honest advice, and no hidden charges — ever."
                    />
                    <ValueCard
                        icon="⭐"
                        title="Customer First"
                        desc="Every decision we make is guided by what&apos;s best for our customers."
                    />
                    <ValueCard
                        icon="🔧"
                        title="Quality Service"
                        desc="From test ride to after-sales support, we are with you every step."
                    />
                </div>
            </div>

            {/* Brands */}
            {displayBrands.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands We Represent</h2>
                    <div className="flex flex-wrap gap-3">
                        {displayBrands.map(b => (
                            <span
                                key={b}
                                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200"
                            >
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Services */}
            {displayServices.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h2>
                    <ul className="grid sm:grid-cols-2 gap-3">
                        {displayServices.map(s => (
                            <li key={s} className="flex items-center gap-2 text-gray-600">
                                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {formatServiceName(s)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Contact CTA */}
            <div className="bg-gray-100 rounded-2xl p-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Get In Touch</h2>
                <p className="text-gray-600 mb-4">We&apos;d love to help you find your next {vehicleWord}.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Us — {phone}
                    </a>
                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {email}
                    </a>
                </div>
                {fullAddress && (
                    <p className="text-xs text-gray-600 mt-4">{fullAddress}</p>
                )}
            </div>
        </div>
    )
}

function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: desc }} />
        </div>
    )
}

function formatServiceName(s: string) {
    return s
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}
