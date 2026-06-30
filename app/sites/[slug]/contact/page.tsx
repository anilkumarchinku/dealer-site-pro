import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getBrandColors } from '@/lib/colors/automotive-brands'
import { BASE_DOMAIN } from '@/lib/utils/domain'
import { ContactMessageForm } from '@/components/sites/ContactMessageForm'
import { LocationsMapSection } from '@/components/templates/sections/LocationsMapSection'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) return {}
    return { title: `Contact Us | ${dealer.dealership_name}` }
}

export default async function ContactPage({ params }: Props) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    const hdrs = await headers()
    const host = hdrs.get('host') ?? ''
    const isMainDomain = host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}` || host.startsWith('localhost') || host.endsWith('.vercel.app')
    const siteHref = isMainDomain ? `/sites/${slug}` : '/'

    // Mirror the brand-name selection used by the public site templates so the
    // /contact page picks up the same per-dealer brand colour.
    const brandName = dealer.brandFilter ?? dealer.brands[0] ?? dealer.dealership_name
    const brandColor = getBrandColors(brandName).primary

    const address = dealer.full_address ?? dealer.location
    const mapQuery = encodeURIComponent(address)
    const waNumber = (dealer.whatsapp ?? dealer.phone).replace(/\D/g, '')

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
            {/* Branded header */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href={siteHref} className="flex min-w-0 items-center gap-3 hover:opacity-80 transition-opacity">
                        {dealer.logo_url && (
                            <div className="relative w-9 h-9 shrink-0">
                                <Image src={dealer.logo_url} alt={dealer.dealership_name} fill className="object-contain" sizes="36px" />
                            </div>
                        )}
                        <span className="truncate text-lg font-bold text-gray-900">{dealer.dealership_name}</span>
                    </Link>
                    <Link
                        href={siteHref}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero — branded accent band */}
                <section
                    className="border-b border-gray-100"
                    style={{ background: `linear-gradient(135deg, ${brandColor}14, #ffffff 70%)` }}
                >
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <span
                            className="font-semibold text-sm uppercase tracking-wider"
                            style={{ color: brandColor }}
                        >
                            Get In Touch
                        </span>
                        <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-gray-900">
                            Contact {dealer.dealership_name}
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-gray-600">
                            {dealer.tagline ?? `We're here to help. Reach out to our team in ${dealer.location} through any of the channels below.`}
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                    {/* Contact cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ContactCard
                            brandColor={brandColor}
                            label="Phone"
                            value={dealer.phone}
                            href={`tel:${dealer.phone}`}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            }
                        />
                        <ContactCard
                            brandColor={brandColor}
                            label="Email"
                            value={dealer.email}
                            href={`mailto:${dealer.email}`}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            }
                        />
                        <ContactCard
                            brandColor={brandColor}
                            label="WhatsApp"
                            value={`+${waNumber}`}
                            href={`https://wa.me/${waNumber}`}
                            external
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 01-11.6 7.13L3 20l1.13-6.4A8 8 0 1121 12z" />
                            }
                        />
                        <ContactCard
                            brandColor={brandColor}
                            label="Address"
                            value={address}
                            href={`https://maps.google.com/?q=${mapQuery}`}
                            external
                            icon={
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </>
                            }
                        />
                    </div>

                    {/* Send a message — writes to the dealer's Messages inbox */}
                    <ContactMessageForm dealerId={dealer.id} brandColor={brandColor} />

                    {/* Working hours */}
                    {dealer.working_hours && (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: `${brandColor}20` }}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: brandColor }} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">Working Hours</h2>
                                    <p className="text-gray-600">{dealer.working_hours}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Map */}
                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Find Us</h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 h-64 sm:h-80">
                            <iframe
                                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                                className="h-full w-full"
                                loading="lazy"
                                title={`${dealer.dealership_name} location map`}
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{dealer.dealership_name} — {address}</p>
                    </div>

                    {/* Branch, Service Center & Outlet Locations */}
                    <LocationsMapSection
                        dealerName={dealer.dealership_name}
                        mainAddress={address}
                        mainPhone={dealer.phone}
                        branches={dealer.branches as Array<{ city: string; address: string; phone?: string }> | null}
                        serviceCenters={dealer.service_centers as Array<{ name: string; address: string; city?: string | null; phone?: string | null }> | null}
                        outlets={dealer.outlets}
                        brandColor={brandColor}
                    />

                    {/* Quick actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href={`tel:${dealer.phone}`}
                            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                            style={{ backgroundColor: brandColor }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Now
                        </a>
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 01-11.6 7.13L3 20l1.13-6.4A8 8 0 1121 12z" />
                            </svg>
                            WhatsApp
                        </a>
                        <a
                            href={`https://maps.google.com/?q=${mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Get Directions
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} {dealer.dealership_name}. All rights reserved.</p>
            </footer>
        </div>
    )
}

function ContactCard({
    brandColor, label, value, href, external, icon,
}: {
    brandColor: string
    label: string
    value: string
    href: string
    external?: boolean
    icon: React.ReactNode
}) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${brandColor}20` }}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: brandColor }} aria-hidden="true">
                    {icon}
                </svg>
            </div>
            <div className="min-w-0">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                <p className="break-words text-sm font-medium text-gray-800">{value}</p>
            </div>
        </a>
    )
}
