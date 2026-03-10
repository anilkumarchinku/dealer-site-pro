'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
    brandColor: string;
    vehicleType?: '2w' | '3w' | '4w';
    dealerName: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

function getFAQs(vehicleType?: '2w' | '3w' | '4w'): FAQItem[] {
    if (vehicleType === '2w') {
        return [
            {
                question: 'What documents are needed to buy a new bike?',
                answer:
                    'Aadhaar, PAN, address proof, and 2 passport photos. For loans, additionally need salary slips or bank statements for 3 months.',
            },
            {
                question: 'Can I book a test ride online?',
                answer:
                    'Yes! Use the "Book Test Ride" button on any bike card. Our executive will contact you within 1 hour to schedule a slot at your preferred time.',
            },
            {
                question: 'What is the EMI for a ₹1 lakh bike?',
                answer:
                    'For ₹1 lakh at 10% interest over 36 months, EMI is approximately ₹3,227/month. Use our EMI calculator for exact figures.',
            },
            {
                question: 'Do you offer exchange for old bikes?',
                answer:
                    'Yes, we accept all brands and models. Get an exchange evaluation at our showroom — we offer competitive prices for well-maintained vehicles.',
            },
            {
                question: 'Is insurance mandatory for a new two-wheeler?',
                answer:
                    'Yes, third-party insurance is mandatory by law. We also offer comprehensive insurance at special rates with doorstep claim assistance.',
            },
            {
                question: 'How long does RTO registration take?',
                answer:
                    'Typically 7–14 working days after purchase. We handle all paperwork and RTO formalities on your behalf.',
            },
        ];
    }

    if (vehicleType === '3w') {
        return [
            {
                question: 'What types of three-wheelers do you sell?',
                answer:
                    'We offer passenger autos, cargo carriers, and electric three-wheelers from top brands. Both CNG and electric variants available.',
            },
            {
                question: 'Can I get a commercial vehicle loan?',
                answer:
                    'Yes, we have tie-ups with major banks for commercial vehicle financing. Up to 80% funding available with flexible EMI options.',
            },
            {
                question: 'What is the permit requirement for a new auto?',
                answer:
                    "You'll need a commercial vehicle permit from the RTO. We assist with all permit-related documentation and guidance.",
            },
            {
                question: 'Do you offer fleet discounts?',
                answer:
                    'Yes, for purchases of 3 or more vehicles, we offer special fleet pricing. Contact our commercial team for customized quotes.',
            },
            {
                question: 'What is the warranty on new three-wheelers?',
                answer:
                    'Standard manufacturer warranty of 1–3 years depending on brand and model. Extended warranty plans also available.',
            },
            {
                question: 'How do I book a trial run?',
                answer:
                    'Click "Book Trial Run" on any vehicle card or call us directly. We offer on-site demonstration at our showroom.',
            },
        ];
    }

    // Default: 4w
    return [
        {
            question: 'What documents are required to purchase a car?',
            answer:
                'Aadhaar card, PAN card, address proof, and 2 passport-size photographs. For loan purchases, additionally need 3 months salary slips and 6 months bank statements.',
        },
        {
            question: 'Can I book a test drive at home?',
            answer:
                'Yes, we offer home test drives! Use the "Book Test Drive" button on any car card. Our team will call within 1 hour to confirm a time slot convenient to you.',
        },
        {
            question: 'What is the on-road price vs ex-showroom price?',
            answer:
                'Ex-showroom is the base price. On-road price includes RTO registration (~8–12% of ex-showroom), 1st year insurance (₹8,000–₹25,000), TCS (1%), and dealer handling charges.',
        },
        {
            question: 'How long does car delivery take?',
            answer:
                'For in-stock models, delivery can happen within 3–7 working days after payment. For specific colors or variants, it may take 2–4 weeks.',
        },
        {
            question: 'Do you have exchange or trade-in facility?',
            answer:
                'Yes! Bring your old car for evaluation. We offer competitive exchange value and the balance can be adjusted against your new car purchase.',
        },
        {
            question: 'What financing options are available?',
            answer:
                'We work with HDFC Bank, ICICI Bank, SBI, Axis Bank, and Kotak. Interest rates start from 8.5% p.a. with tenure up to 84 months.',
        },
    ];
}

function FAQItem({
    item,
    isOpen,
    onToggle,
    brandColor,
}: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
    brandColor: string;
}) {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left gap-4"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {item.question}
                </span>
                <ChevronDown
                    className="w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: isOpen ? brandColor : undefined,
                    }}
                />
            </button>

            {/* Smooth height transition via max-height trick */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? '500px' : '0px' }}
            >
                <p className="text-sm text-gray-600 leading-relaxed pb-4 pr-8">
                    {item.answer}
                </p>
            </div>
        </div>
    );
}

export function FAQSection({ brandColor, vehicleType, dealerName }: FAQSectionProps) {
    const faqs = getFAQs(vehicleType);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    function toggle(index: number) {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Frequently Asked
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Questions
                    </h2>
                    <p className="mt-3 text-gray-500 text-sm">
                        Everything you need to know before visiting {dealerName}.
                    </p>
                </div>

                {/* Accordion */}
                <div>
                    {faqs.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onToggle={() => toggle(index)}
                            brandColor={brandColor}
                        />
                    ))}
                </div>

                {/* Footer note */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    Still have questions?{' '}
                    <a
                        href="#contact"
                        className="font-semibold hover:underline"
                        style={{ color: brandColor }}
                    >
                        Contact us
                    </a>{' '}
                    and we&apos;ll be happy to help.
                </p>
            </div>
        </section>
    );
}
