'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getReadableAccent } from '@/lib/utils/color-contrast';

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
                    'Yes! Use the "Book Test Ride" button on any bike card. Our team will get back to you to schedule a slot at your preferred time.',
            },
            {
                question: 'What would the EMI be on a two-wheeler loan?',
                answer:
                    'It depends on the loan amount, interest rate, and tenure. Use our EMI calculator for an indicative estimate, and contact us for current rates and exact figures.',
            },
            {
                question: 'Do you offer exchange for old bikes?',
                answer:
                    'Yes, we accept all brands and models. Get an exchange evaluation at our showroom — we offer competitive prices for well-maintained vehicles.',
            },
            {
                question: 'Is insurance mandatory for a new two-wheeler?',
                answer:
                    'Yes, third-party insurance is mandatory by law. We can also help you arrange comprehensive insurance through trusted partners with claim assistance.',
            },
            {
                question: 'How long does RTO registration take?',
                answer:
                    'Timelines vary by RTO and location. We handle all paperwork and RTO formalities on your behalf — contact us for current processing times.',
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
                    'Yes, we help arrange commercial vehicle financing through leading banks and NBFCs, with flexible EMI options. Contact us for the funding and terms currently available.',
            },
            {
                question: 'What is the permit requirement for a new auto?',
                answer:
                    "You'll need a commercial vehicle permit from the RTO. We assist with all permit-related documentation and guidance.",
            },
            {
                question: 'Do you offer fleet discounts?',
                answer:
                    'We offer tailored options for bulk and fleet purchases. Contact our commercial team for a customized quote.',
            },
            {
                question: 'What is the warranty on new three-wheelers?',
                answer:
                    'New vehicles come with the standard manufacturer warranty, which varies by brand and model. Extended warranty plans may also be available — contact us for details.',
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
                'Yes, we offer home test drives! Use the "Book Test Drive" button on any car card. Our team will get back to you to confirm a time slot convenient to you.',
        },
        {
            question: 'What is the on-road price vs ex-showroom price?',
            answer:
                'Ex-showroom is the base price. The on-road price additionally includes RTO registration, road tax, first-year insurance, and applicable charges, which vary by state and variant. Contact us for an exact on-road quote for the model you want.',
        },
        {
            question: 'How long does car delivery take?',
            answer:
                'Delivery timelines depend on the model, variant, and colour you choose and on stock availability. Contact us for the expected timeline on the vehicle you want.',
        },
        {
            question: 'Do you have exchange or trade-in facility?',
            answer:
                'Yes! Bring your old car for evaluation. We offer competitive exchange value and the balance can be adjusted against your new car purchase.',
        },
        {
            question: 'What financing options are available?',
            answer:
                'We help you arrange financing through leading banks and NBFCs, with flexible tenure options. Rates are indicative and vary by lender and profile — contact us for the current options for your purchase.',
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
    const brandAccent = getReadableAccent(brandColor);

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
                    className="w-5 h-5 shrink-0 text-gray-600 transition-transform duration-300"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: isOpen ? brandAccent : undefined,
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
    const brandAccent = getReadableAccent(brandColor);

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
                        style={{ color: brandAccent }}
                    >
                        Frequently Asked
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Questions
                    </h2>
                    <p className="mt-3 text-gray-600 text-sm">
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
                <p className="mt-8 text-center text-sm text-gray-600">
                    Still have questions?{' '}
                    <a
                        href="#contact"
                        className="font-semibold hover:underline"
                        style={{ color: brandAccent }}
                    >
                        Contact us
                    </a>{' '}
                    and we&apos;ll be happy to help.
                </p>
            </div>
        </section>
    );
}
