/**
 * EnquireSidebar
 * Right-side drawer that shows dealer services + a callback request form.
 * Triggered by the "Enquire Now" button in every template header.
 */

'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Service } from '@/lib/types';
import {
    Car,
    CreditCard,
    Wrench,
    ArrowLeftRight,
    Shield,
    Phone,
    Zap,
    Package,
    Users,
    FileText,
    CheckCircle2,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

// ── Service catalogue ─────────────────────────────────────────────────────────

interface ServiceInfo {
    id: Service;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}

const ALL_SERVICES: ServiceInfo[] = [
    {
        id: 'home_test_drives',
        label: 'Book Test Drive',
        description: 'Experience the car at your doorstep',
        icon: Car,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
    },
    {
        id: 'financing',
        label: 'Finance Quote',
        description: 'Easy EMI options & loan assistance',
        icon: CreditCard,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
    },
    {
        id: 'parts_accessories',
        label: 'Accessories',
        description: 'Genuine parts & custom accessories',
        icon: Package,
        color: 'text-violet-600',
        bg: 'bg-violet-50 border-violet-200',
    },
    {
        id: 'trade_in',
        label: 'Trade In',
        description: 'Get the best value for your old car',
        icon: ArrowLeftRight,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
    },
    {
        id: 'insurance',
        label: 'Insurance',
        description: 'Comprehensive coverage at best rates',
        icon: Shield,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
    },
    {
        id: 'service_maintenance',
        label: 'Service & Maintenance',
        description: 'Authorized service centre',
        icon: Wrench,
        color: 'text-orange-600',
        bg: 'bg-orange-50 border-orange-200',
    },
    {
        id: 'express_service',
        label: 'Express Service',
        description: 'Quick turnaround service',
        icon: Zap,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200',
    },
    {
        id: 'extended_warranties',
        label: 'Extended Warranty',
        description: 'Extra protection for your vehicle',
        icon: FileText,
        color: 'text-teal-600',
        bg: 'bg-teal-50 border-teal-200',
    },
    {
        id: 'fleet_sales',
        label: 'Fleet Sales',
        description: 'Corporate & bulk vehicle solutions',
        icon: Users,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50 border-indigo-200',
    },
    {
        id: 'buy_accessories',
        label: 'Buy Accessories',
        description: 'Shop our accessories catalogue',
        icon: Sparkles,
        color: 'text-pink-600',
        bg: 'bg-pink-50 border-pink-200',
    },
    {
        id: 'new_car_sales',
        label: 'New Car Enquiry',
        description: 'Browse our latest new car models',
        icon: Car,
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
    },
    {
        id: 'used_car_sales',
        label: 'Used Car Enquiry',
        description: 'Certified pre-owned vehicles',
        icon: Car,
        color: 'text-gray-600',
        bg: 'bg-gray-50 border-gray-200',
    },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface EnquireSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dealerName: string;
    brandColor?: string;
    /** Services the dealer offers — if omitted, all are shown */
    services?: Service[];
    contactPhone?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EnquireSidebar({
    open,
    onOpenChange,
    dealerName,
    brandColor = '#2563eb',
    services,
    contactPhone,
}: EnquireSidebarProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        preferredTime: '',
        message: '',
    });

    // Filter to only services the dealer offers; fallback to all
    const visibleServices = services && services.length > 0
        ? ALL_SERVICES.filter(s => services.includes(s.id))
        : ALL_SERVICES;

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire up to Supabase leads table
        console.log('Enquiry submitted:', { selectedService, ...form });
        setSubmitted(true);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset after close animation
        setTimeout(() => {
            setSubmitted(false);
            setSelectedService(null);
            setForm({ name: '', phone: '', preferredTime: '', message: '' });
        }, 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-[420px] p-0 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-5 border-b" style={{ borderColor: `${brandColor}20` }}>
                    <SheetHeader>
                        <SheetTitle className="text-lg font-bold text-gray-900">
                            How Can We Help You?
                        </SheetTitle>
                        <SheetDescription className="text-sm text-gray-500">
                            {dealerName} — choose a service & we'll call you back
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {submitted ? (
                    /* ── Success state ── */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${brandColor}15` }}>
                            <CheckCircle2 className="w-8 h-8" style={{ color: brandColor }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Request Received!
                        </h3>
                        <p className="text-gray-500 text-sm mb-1">
                            Thank you, <strong>{form.name}</strong>!
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Our team will call you at <strong>{form.phone}</strong> shortly.
                        </p>
                        {contactPhone && (
                            <a
                                href={`tel:${contactPhone}`}
                                className="text-sm font-medium flex items-center gap-2 mb-6"
                                style={{ color: brandColor }}
                            >
                                <Phone className="w-4 h-4" />
                                Can't wait? Call us now
                            </a>
                        )}
                        <Button
                            onClick={handleClose}
                            className="text-white"
                            style={{ backgroundColor: brandColor }}
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    /* ── Main content ── */
                    <div className="flex-1 overflow-y-auto">
                        {/* Service tiles */}
                        <div className="p-5 pb-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Select a Service
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {visibleServices.map((svc) => {
                                    const Icon = svc.icon;
                                    const isSelected = selectedService === svc.id;
                                    return (
                                        <button
                                            key={svc.id}
                                            onClick={() => setSelectedService(isSelected ? null : svc.id)}
                                            className={`
                                                relative text-left p-3 rounded-xl border transition-all duration-200
                                                ${isSelected
                                                    ? 'border-2 shadow-sm'
                                                    : `${svc.bg} hover:shadow-sm`}
                                            `}
                                            style={isSelected ? {
                                                backgroundColor: `${brandColor}10`,
                                                borderColor: brandColor,
                                            } : {}}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${isSelected ? 'bg-white' : 'bg-white/80'}`}>
                                                <Icon className={`w-4 h-4 ${isSelected ? '' : svc.color}`}
                                                    style={isSelected ? { color: brandColor } : {}} />
                                            </div>
                                            <p className={`text-xs font-semibold leading-tight ${isSelected ? '' : 'text-gray-800'}`}
                                                style={isSelected ? { color: brandColor } : {}}>
                                                {svc.label}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-1">
                                                {svc.description}
                                            </p>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: brandColor }}>
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="px-5 py-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-100" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Get a Callback
                                </p>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>
                        </div>

                        {/* Callback form */}
                        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
                            <div>
                                <Label htmlFor="eq-name" className="text-xs font-semibold text-gray-600 mb-1 block">
                                    Your Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="eq-name"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>

                            <div>
                                <Label htmlFor="eq-phone" className="text-xs font-semibold text-gray-600 mb-1 block">
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="eq-phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>

                            <div>
                                <Label htmlFor="eq-time" className="text-xs font-semibold text-gray-600 mb-1 block">
                                    Best Time to Call
                                </Label>
                                <select
                                    id="eq-time"
                                    value={form.preferredTime}
                                    onChange={e => handleChange('preferredTime', e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Any time</option>
                                    <option value="morning">Morning (9am – 12pm)</option>
                                    <option value="afternoon">Afternoon (12pm – 4pm)</option>
                                    <option value="evening">Evening (4pm – 7pm)</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="eq-msg" className="text-xs font-semibold text-gray-600 mb-1 block">
                                    Message / Requirement
                                </Label>
                                <Textarea
                                    id="eq-msg"
                                    placeholder="Tell us what you're looking for…"
                                    rows={3}
                                    value={form.message}
                                    onChange={e => handleChange('message', e.target.value)}
                                    className="text-sm resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-white font-semibold h-11 transition-all"
                                style={{ backgroundColor: brandColor }}
                                disabled={!form.name || !form.phone}
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Request Callback
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>

                            {contactPhone && (
                                <p className="text-center text-xs text-gray-400">
                                    Or call us directly:{' '}
                                    <a href={`tel:${contactPhone}`} className="font-semibold" style={{ color: brandColor }}>
                                        {contactPhone}
                                    </a>
                                </p>
                            )}
                        </form>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
