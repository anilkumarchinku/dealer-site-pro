"use client"

import { useState, useEffect } from 'react';
import { X, Phone, Mail, MessageSquare, Calendar, Fuel, Gauge, Users, Settings2, Car, Palette, Zap, Shield, Award } from 'lucide-react';
import type { CarModel } from '@/lib/data/car-models';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    car: CarModel | null;
    brandColors: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

interface FormData {
    fullName: string;
    phone: string;
    email: string;
    contactMethod: 'phone' | 'email' | 'whatsapp';
    message: string;
    testDriveInterest: boolean;
}

export default function LeadCaptureModal({ isOpen, onClose, car, brandColors }: LeadCaptureModalProps) {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        email: '',
        contactMethod: 'phone',
        message: '',
        testDriveInterest: false,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    contactMethod: 'phone',
                    message: '',
                    testDriveInterest: false,
                });
                setErrors({});
                setIsSuccess(false);
            }, 300);
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        // Phone validation (Indian format)
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Log the lead data (in production, this would send to backend)
        console.log('📝 New Lead Captured:', {
            ...formData,
            car: {
                id: car?.id,
                brand: car?.brand,
                name: car?.name,
                price: car?.price,
            },
            timestamp: new Date().toISOString(),
        });

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen || !car) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Car Image */}
                <div className="relative h-64 bg-gray-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Car Info Overlay */}
                    <div className="absolute bottom-6 left-8 right-8 text-white">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-widest uppercase text-gray-300 mb-1">{car.brand}</p>
                                <h2 className="text-4xl font-bold mb-2">{car.name}</h2>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/10">
                                        {car.bodyType}
                                    </span>
                                    {car.variant && (
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/10">
                                            {car.variant}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">{car.price}</div>
                                <p className="text-sm text-gray-300 mt-1">*Ex-showroom Price</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* 1. KEY FEATURES (Top) */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {car.features.map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border"
                                    style={{
                                        backgroundColor: `${brandColors.primary}08`,
                                        borderColor: `${brandColors.primary}20`,
                                        color: brandColors.primary
                                    }}
                                >
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    {feature}
                                </span>
                            ))}
                            {/* Add some standard features if specific ones are missing, to pad the UI */}
                            {car.features.length < 3 && (
                                <>
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-100 bg-gray-50 text-gray-600">
                                        <Shield className="w-3.5 h-3.5" /> Dual Airbags
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-100 bg-gray-50 text-gray-600">
                                        <Settings2 className="w-3.5 h-3.5" /> ABS with EBD
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 2. DETAILED SPECIFICATIONS (Split View) */}
                    {car.specs && (
                        <div className="mb-10">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">
                                <Shield className="w-4 h-4 text-gray-400" />
                                Detailed Specifications
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Engine & Performance */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Engine & Performance</h4>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Engine Type</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.engine?.type || 'Petrol'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Displacement</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.engine?.displacement ? `${car.specs.engine.displacement} cc` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Max Power</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.engine?.power || 'TBD'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Max Torque</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.engine?.torque || 'TBD'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Mileage (ARAI)</span>
                                            <span className="text-sm font-bold text-green-600">{car.mileage}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Dimensions & Capacity */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Dimensions & Capacity</h4>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Gearbox</span>
                                            <span className="text-sm font-medium text-gray-900">{car.transmission.join(' / ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Seating Capacity</span>
                                            <span className="text-sm font-medium text-gray-900">{car.seating} Persons</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Fuel Tank</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.dimensions?.fuelTankCapacity ? `${car.specs.dimensions.fuelTankCapacity} L` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Ground Clearance</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.dimensions?.groundClearance ? `${car.specs.dimensions.groundClearance} mm` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-gray-500">Boot Space</span>
                                            <span className="text-sm font-medium text-gray-900">{car.specs.dimensions?.bootSpace ? `${car.specs.dimensions.bootSpace} L` : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. LEAD GEN FORM (Bottom) */}
                    <div className="border-t border-gray-100 pt-8">
                        {isSuccess ? (
                            <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-100">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent Successfully!</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Thanks for interest in the {car.name}. Our team will contact you shortly to schedule your test drive.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-2.5 rounded-lg font-medium text-white shadow-md transition-all hover:shadow-lg"
                                    style={{ backgroundColor: brandColors.primary }}
                                >
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Get More Information</h3>
                                <p className="text-gray-500 text-sm mb-6">Fill in your details and we'll get back to you soon!</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => handleChange('fullName', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange('phone', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder="98765 43210"
                                                />
                                            </div>
                                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                        style={{ backgroundColor: brandColors.primary }}
                                    >
                                        {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
