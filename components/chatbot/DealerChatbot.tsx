/**
 * DealerChatbot — Rule-based chatbot widget
 * Floats bottom-right; answers questions about the dealer using
 * keyword matching and predefined response trees.
 * No AI / external API calls — fully offline rule engine.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, PhoneCall, ChevronDown } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DealerInfo {
    dealerName: string;
    brandName: string;
    phone: string;
    whatsapp?: string;
    address: string;
    workingHours?: string | null;
    vehicleType?: '2w' | '3w' | '4w';
    brandColor: string;
    cars?: { make: string; model: string; price?: string; condition?: string }[];
    services?: string[];
}

interface Message {
    id: string;
    from: 'bot' | 'user';
    text: string;
    quickReplies?: string[];
    link?: { label: string; href: string };
    timestamp: Date;
}

// ── Intent engine ─────────────────────────────────────────────────────────────

type Intent =
    | 'greeting' | 'price' | 'test_drive' | 'hours' | 'location'
    | 'contact' | 'offers' | 'exchange' | 'services' | 'models'
    | 'finance' | 'insurance' | 'thanks' | 'bye' | 'human' | 'unknown';

const INTENT_MAP: Record<Intent, string[]> = {
    greeting:   ['hi', 'hello', 'hey', 'good morning', 'good evening', 'namaste', 'hii', 'helo', 'hai', 'sup', 'start'],
    price:      ['price', 'cost', 'how much', 'rate', 'charges', 'amount', 'kitna', 'rates', 'pricing', 'ex showroom', 'on road'],
    test_drive: ['test drive', 'test ride', 'trial', 'test', 'drive', 'ride', 'book test', 'trial run', 'td'],
    hours:      ['timing', 'time', 'open', 'close', 'hours', 'when', 'schedule', 'timings', 'today open', 'sunday'],
    location:   ['address', 'location', 'where', 'map', 'directions', 'showroom', 'reach', 'nearby', 'how to reach', 'google map'],
    contact:    ['call', 'phone', 'number', 'contact', 'speak', 'reach you', 'helpline'],
    offers:     ['offer', 'discount', 'scheme', 'deal', 'promotion', 'cashback', 'bonus', 'festive', 'diwali', 'special', 'current offer'],
    exchange:   ['exchange', 'trade', 'old car', 'old bike', 'old auto', 'sell my', 'swap', 'trade in', 'exchange value'],
    services:   ['service', 'repair', 'maintenance', 'warranty', 'amc', 'service center', 'after sales'],
    models:     ['model', 'car', 'vehicle', 'bike', 'auto', 'available', 'stock', 'colors', 'variant', 'which', 'show', 'list', 'bikes'],
    finance:    ['emi', 'loan', 'finance', 'bank', 'installment', 'monthly', 'down payment', 'interest', 'tenure'],
    insurance:  ['insurance', 'policy', 'cover', 'claim', 'insur'],
    thanks:     ['thanks', 'thank you', 'thx', 'ok thank', 'ok', 'great', 'nice', 'good', 'cool', 'perfect', 'got it'],
    bye:        ['bye', 'goodbye', 'see you', 'tata', 'later', 'done', 'nothing', 'no more'],
    human:      ['agent', 'human', 'person', 'staff', 'executive', 'talk to', 'someone', 'representative', 'speak to'],
    unknown:    [],
};

function detectIntent(input: string): Intent {
    const lower = input.toLowerCase().trim();
    for (const [intent, keywords] of Object.entries(INTENT_MAP) as [Intent, string[]][]) {
        if (intent === 'unknown') continue;
        if (keywords.some(kw => lower.includes(kw))) return intent;
    }
    return 'unknown';
}

// ── Vehicle-type helpers ───────────────────────────────────────────────────────

function vehicleWord(vt?: '2w' | '3w' | '4w') {
    if (vt === '2w') return 'bike/scooter';
    if (vt === '3w') return 'auto/cargo vehicle';
    return 'car';
}

function testDriveWord(vt?: '2w' | '3w' | '4w') {
    if (vt === '2w') return 'test ride';
    if (vt === '3w') return 'trial run';
    return 'test drive';
}

function emiStart(vt?: '2w' | '3w' | '4w') {
    if (vt === '2w') return '₹999/month';
    if (vt === '3w') return '₹1,999/month';
    return '₹3,999/month';
}

// ── Response builder ──────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2); }

function botMsg(text: string, quickReplies?: string[], link?: { label: string; href: string }): Message {
    return { id: uid(), from: 'bot', text, quickReplies, link, timestamp: new Date() };
}

function buildResponse(intent: Intent, info: DealerInfo): Message[] {
    const vt = info.vehicleType;
    const vw = vehicleWord(vt);
    const td = testDriveWord(vt);

    switch (intent) {
        case 'greeting':
            return [botMsg(
                `👋 Hi there! Welcome to **${info.dealerName}**. I'm here to help you with any questions about our ${vw}s, pricing, offers, and more.`,
                ['See Models', 'Current Offers', 'Book Test Drive', 'Contact Us']
            )];

        case 'models': {
            const newCars = info.cars?.filter(c => c.condition !== 'used' && c.condition !== 'certified_pre_owned').slice(0, 5) ?? [];
            if (newCars.length > 0) {
                const list = newCars.map(c => `• ${c.make} ${c.model}${c.price ? ' — ' + c.price : ''}`).join('\n');
                return [botMsg(
                    `Here are some of our featured ${vw}s:\n\n${list}\n\nWould you like more details on any of these?`,
                    ['Get Pricing', 'Book Test Drive', 'See All Vehicles', 'Talk to Salesperson']
                )];
            }
            return [botMsg(
                `We have a wide range of ${vw}s at ${info.dealerName}. Please visit our showroom or call us to check current stock and availability.`,
                ['Call Now', 'Working Hours', 'Get Directions']
            )];
        }

        case 'price':
            return [botMsg(
                `Our ${vw} prices start from ₹50,000 onwards, varying by brand, model, and variant. For the exact ex-showroom and on-road price in your city, please share the model name or call us directly.`,
                ['Get Exact Price', 'EMI Options', 'Current Offers', 'Call Now']
            )];

        case 'test_drive':
            return [botMsg(
                `🚗 Great choice! You can book a **${td}** for any ${vw} right from our website — just click the "Book Test Drive" button on any vehicle card.\n\nAlternatively, call us and we'll set it up within 1 hour!`,
                ['Call to Book', 'WhatsApp Us', 'See Models']
            )];

        case 'hours': {
            const hours = info.workingHours ?? 'Monday–Saturday: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 5:00 PM';
            return [botMsg(
                `⏰ Our showroom is open:\n\n${hours}\n\nFeel free to walk in or book an appointment in advance!`,
                ['Get Directions', 'Book Test Drive', 'Call Now']
            )];
        }

        case 'location':
            return [botMsg(
                `📍 We're located at:\n\n${info.address}\n\nYou can search for **${info.dealerName}** on Google Maps to get directions from your current location.`,
                ['Working Hours', 'Call for Directions', 'Book Test Drive']
            )];

        case 'contact': {
            const wp = info.whatsapp ?? info.phone;
            return [botMsg(
                `📞 You can reach us at:\n\n**Phone:** ${info.phone}\n**WhatsApp:** ${wp}\n\nOur team is available during showroom hours.`,
                ['Call Now', 'WhatsApp Us', 'Working Hours'],
                { label: `Call ${info.phone}`, href: `tel:${info.phone}` }
            )];
        }

        case 'offers':
            return [botMsg(
                `🎉 Current offers at ${info.dealerName}:\n\n• 🔄 **Exchange Bonus** — Up to ₹30,000 on your old ${vw}\n• 🛡️ **Free Insurance** — 1-year comprehensive insurance on new purchases\n• 💳 **Zero Processing Fee** — On loans above ₹1 lakh\n• 🏢 **Corporate Discount** — For govt employees & defence personnel\n\nOffers valid this month. T&C apply.`,
                ['Exchange My Old Vehicle', 'EMI Options', 'Call for Best Price']
            )];

        case 'exchange':
            return [botMsg(
                `🔄 Yes, we accept old ${vw}s for exchange! Here's how it works:\n\n1️⃣ Bring your vehicle to our showroom\n2️⃣ Our expert evaluates it (free, 15 minutes)\n3️⃣ Get a transparent price quote\n4️⃣ Adjust the value against your new purchase\n\nWe accept all brands and models!`,
                ['Book Evaluation', 'Call Now', 'Current Offers']
            )];

        case 'services':
            return [botMsg(
                `🔧 Our services include:\n\n${(info.services ?? ['New vehicle sales', 'Pre-owned vehicles', 'Test drives', 'Finance & loans', 'Insurance', 'Extended warranty', 'Exchange/Trade-in']).map(s => '• ' + s).join('\n')}\n\nAnything specific you need?`,
                ['Book Service', 'Finance Options', 'Insurance', 'Call Us']
            )];

        case 'finance':
            return [botMsg(
                `💰 We offer flexible finance options:\n\n• **EMI starting:** ${emiStart(vt)}\n• **Down payment:** As low as 10%\n• **Tenure:** Up to 84 months\n• **Banks:** HDFC, ICICI, SBI, Axis, Kotak\n• **Rate of interest:** From 8.5% p.a.\n\nUse the EMI Calculator on our website for exact figures!`,
                ['Calculate EMI', 'Apply for Loan', 'Current Offers', 'Call Now']
            )];

        case 'insurance':
            return [botMsg(
                `🛡️ We offer comprehensive vehicle insurance through top providers:\n\n• 1st year insurance FREE on new purchases (limited time)\n• Renewal assistance\n• Cashless claim network across India\n• Roadside assistance included\n\nContact us for a quick insurance quote!`,
                ['Get Insurance Quote', 'Current Offers', 'Call Now']
            )];

        case 'thanks':
            return [botMsg(
                `😊 You're welcome! Is there anything else I can help you with?`,
                ['See Offers', 'Book Test Drive', 'Talk to Agent', 'Bye']
            )];

        case 'bye':
            return [botMsg(
                `👋 Thank you for visiting **${info.dealerName}**! We hope to see you at our showroom soon. Have a great day! 🚗`,
                ['Start Over']
            )];

        case 'human': {
            const wp2 = info.whatsapp ?? info.phone;
            return [botMsg(
                `Of course! Let me connect you with our team right away. You can reach us via:`,
                ['Call Now', 'WhatsApp Us'],
                { label: `Chat on WhatsApp`, href: `https://wa.me/${wp2.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(info.dealerName)}%2C%20I%20need%20assistance` }
            )];
        }

        default:
            return [botMsg(
                `I'm not sure I understood that. Here's what I can help you with:`,
                ['Prices & Offers', 'Book Test Drive', 'Working Hours', 'Location', 'Talk to Agent']
            )];
    }
}

// ── Quick reply → intent mapping ──────────────────────────────────────────────

const QUICK_REPLY_INTENTS: Record<string, Intent> = {
    'See Models': 'models',
    'See All Vehicles': 'models',
    'Current Offers': 'offers',
    'Prices & Offers': 'offers',
    'Book Test Drive': 'test_drive',
    'Contact Us': 'contact',
    'Call Now': 'contact',
    'Call for Best Price': 'contact',
    'Call for Directions': 'contact',
    'Call to Book': 'contact',
    'Call Us': 'contact',
    'Apply for Loan': 'finance',
    'WhatsApp Us': 'human',
    'Talk to Agent': 'human',
    'Talk to Salesperson': 'human',
    'Working Hours': 'hours',
    'Get Directions': 'location',
    'EMI Options': 'finance',
    'Calculate EMI': 'finance',
    'Finance Options': 'finance',
    'Get Pricing': 'price',
    'Get Exact Price': 'price',
    'Exchange My Old Vehicle': 'exchange',
    'Book Evaluation': 'exchange',
    'Get Insurance Quote': 'insurance',
    'Insurance': 'insurance',
    'Book Service': 'services',
    'Bye': 'bye',
    'Start Over': 'greeting',
};

// ── Component ─────────────────────────────────────────────────────────────────

type DealerChatbotProps = DealerInfo

export function DealerChatbot(props: DealerChatbotProps) {
    const { brandColor, phone, whatsapp } = props;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unread, setUnread] = useState(1); // show 1 on first load
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ── Welcome message on mount ──────────────────────────────────────────────
    useEffect(() => {
        const welcome = botMsg(
            `👋 Hi! I'm the virtual assistant for **${props.dealerName}**.\n\nHow can I help you today?`,
            ['See Models', 'Current Offers', 'Book Test Drive', 'Working Hours', 'Location']
        );
        setMessages([welcome]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Scroll to bottom on new messages ─────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Focus input when opened ───────────────────────────────────────────────
    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const addBotResponse = useCallback((intent: Intent) => {
        setIsTyping(true);
        setTimeout(() => {
            const responses = buildResponse(intent, props);
            setMessages(prev => [...prev, ...responses]);
            setIsTyping(false);
            if (!open) setUnread(u => u + 1);
        }, 600);
    }, [props, open]);

    const handleSend = useCallback((text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg) return;
        setInput('');

        // Add user message
        const userMsg: Message = { id: uid(), from: 'user', text: msg, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        // Detect intent and respond
        const intent = QUICK_REPLY_INTENTS[msg] ?? detectIntent(msg);
        addBotResponse(intent);
    }, [input, addBotResponse]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Chat window ── */}
            {open && (
                <div
                    className="fixed bottom-36 right-4 z-50 w-[340px] sm:w-[360px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-none">{props.dealerName}</p>
                                <p className="text-[11px] text-white/80 mt-0.5">Virtual Assistant • Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`tel:${phone}`}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                title="Call Us"
                            >
                                <PhoneCall className="w-4 h-4 text-white" />
                            </a>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <ChevronDown className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
                        {messages.map(msg => (
                            <div key={msg.id}>
                                {/* Bubble */}
                                <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.from === 'bot' && (
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0 text-white text-xs font-bold"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            AI
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            msg.from === 'user'
                                                ? 'text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                                        }`}
                                        style={msg.from === 'user' ? { backgroundColor: brandColor } : {}}
                                    >
                                        {/* Bold **text** support */}
                                        {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                                            part.startsWith('**') && part.endsWith('**')
                                                ? <strong key={i}>{part.slice(2, -2)}</strong>
                                                : <span key={i}>{part}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Link button */}
                                {msg.from === 'bot' && msg.link && (
                                    <div className="ml-9 mt-1.5">
                                        <a
                                            href={msg.link.href}
                                            target={msg.link.href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            {msg.link.label}
                                        </a>
                                    </div>
                                )}

                                {/* Quick replies */}
                                {msg.from === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                                    <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                                        {msg.quickReplies.map(qr => {
                                            // Special actions
                                            if (qr === 'Call Now') {
                                                return (
                                                    <a key={qr} href={`tel:${phone}`}
                                                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold border-2 bg-white transition-all hover:scale-105"
                                                        style={{ borderColor: brandColor, color: brandColor }}
                                                    >{qr}</a>
                                                );
                                            }
                                            if (qr === 'WhatsApp Us') {
                                                const wp = (whatsapp ?? phone).replace(/\D/g, '');
                                                return (
                                                    <a key={qr} href={`https://wa.me/${wp}`} target="_blank" rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold border-2 border-green-500 text-green-600 bg-white transition-all hover:scale-105"
                                                    >{qr}</a>
                                                );
                                            }
                                            return (
                                                <button
                                                    key={qr}
                                                    onClick={() => handleSend(qr)}
                                                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold border-2 bg-white transition-all hover:scale-105"
                                                    style={{ borderColor: brandColor, color: brandColor }}
                                                >
                                                    {qr}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: brandColor }}>AI</div>
                                <div className="bg-white rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm border border-gray-100">
                                    <div className="flex gap-1 items-center h-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 py-2.5 border-t border-gray-100 bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message…"
                                className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                                style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                                style={{ backgroundColor: brandColor }}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-center text-[9px] text-gray-400 mt-1.5">
                            Powered by DealerSite Pro
                        </p>
                    </div>
                </div>
            )}

            {/* ── Floating bubble ── */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: brandColor }}
                aria-label="Open chat"
            >
                {open ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6" />
                        {unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unread}
                            </span>
                        )}
                    </>
                )}
            </button>
        </>
    );
}
