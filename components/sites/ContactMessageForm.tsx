'use client';

/**
 * "Send us a message" form for the dealer-site /contact pages.
 * Posts to /api/messages → surfaces in the dealer dashboard Messages inbox.
 * Part of the fixed light public-site skin (white surfaces, brand-coloured CTA).
 */

import { useState, type FormEvent, type CSSProperties } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { getContrastText } from '@/lib/utils/color-contrast';

interface ContactMessageFormProps {
    dealerId: string;
    brandColor: string;
}

export function ContactMessageForm({ dealerId, brandColor }: ContactMessageFormProps) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const ringStyle = { '--tw-ring-color': brandColor } as CSSProperties;
    const inputCls =
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (form.name.trim().length < 2) { setError('Please enter your name.'); return; }
        if (form.message.trim().length < 1) { setError('Please enter a message.'); return; }
        if (!consent) { setError('Please agree to be contacted.'); return; }
        setError(null);
        setStatus('sending');
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    sender_name: form.name.trim(),
                    sender_email: form.email.trim(),
                    sender_phone: form.phone.trim(),
                    subject: form.subject.trim(),
                    content: form.message.trim(),
                }),
            });
            if (res.ok) {
                setStatus('sent');
            } else {
                setStatus('error');
                setError('Something went wrong. Please try again or call us directly.');
            }
        } catch {
            setStatus('error');
            setError('Something went wrong. Please try again or call us directly.');
        }
    };

    if (status === 'sent') {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-3 h-14 w-14" style={{ color: brandColor }} />
                <h2 className="text-xl font-bold text-gray-900">Message sent</h2>
                <p className="mt-1 text-gray-600">Thanks for reaching out — our team will get back to you soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                <p className="mt-1 text-sm text-gray-600">Have a question? Send us a note and our team will reply.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                        style={ringStyle}
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className={inputCls}
                        style={ringStyle}
                        placeholder="Phone (optional)"
                    />
                </div>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    style={ringStyle}
                    placeholder="you@email.com (optional)"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className={inputCls}
                    style={ringStyle}
                    placeholder="Subject (optional)"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className={`${inputCls} resize-none`}
                    style={ringStyle}
                    placeholder="How can we help?"
                />
            </div>
            <label className="flex items-start gap-2 text-xs text-gray-600">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <span>I agree to be contacted about my message.</span>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
            >
                {status === 'sending' ? 'Sending…' : (<><Send className="h-4 w-4" /> Send Message</>)}
            </button>
        </form>
    );
}
