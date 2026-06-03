'use client';

import { useState } from 'react';
import { CheckCircle2, Wrench } from 'lucide-react';

interface ServiceCenter {
    id: string;
    name: string;
    address?: string;
    city?: string;
    phone?: string;
}

interface ServiceBookingSectionProps {
    brandColor: string;
    dealerId?: string;
    dealerName: string;
    vehicleType?: '2w' | '3w' | '4w';
    branches?: Array<{ city?: string; address?: string; phone?: string }>;
    serviceCenters?: ServiceCenter[]; // Real service centers from database
}

function getServiceTypes(vehicleType?: '2w' | '3w' | '4w'): string[] {
    if (vehicleType === '2w') return ['Periodic Service', 'Oil Change', 'Tyre Check', 'Breakdown Repair'];
    if (vehicleType === '3w') return ['Periodic Service', 'CNG Kit Service', 'Body Repair', 'Breakdown Repair'];
    return ['Periodic Service', 'AC Service', 'Tyre & Alignment', 'Accident Repair'];
}

const TIME_SLOTS = [
    { label: 'Morning 9–11am', value: '9am-11am' },
    { label: 'Afternoon 11am–2pm', value: '11am-2pm' },
    { label: 'Evening 2–5pm', value: '2pm-5pm' },
];

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

interface FormState {
    regNumber: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    vehicleMake: string;
    vehicleModel: string;
    kmReading: string;
    location: string;
    notes: string;
}

export function ServiceBookingSection({
    brandColor,
    dealerId,
    dealerName,
    vehicleType,
    branches = [],
    serviceCenters = [],
}: ServiceBookingSectionProps) {
    const serviceTypes = getServiceTypes(vehicleType);

    // Use real service centers from database first, then fall back to branches
    const serviceLocations = serviceCenters.length > 0
        ? serviceCenters.map((center) => ({
            name: center.name,
            meta: center.address || center.city || center.phone || 'Service center',
        }))
        : branches.length > 0
        ? branches.slice(0, 4).map((branch, index) => ({
            name: branch.city ? `${dealerName} ${branch.city}` : `${dealerName} Branch ${index + 1}`,
            meta: branch.address || branch.phone || 'Showroom and service touchpoint',
        }))
        : [
            // Fallback only if no service centers or branches configured
            { name: `${dealerName} Service Center`, meta: 'Contact dealer for location details' },
        ];

    const [selectedService, setSelectedService] = useState(serviceTypes[0]);
    const [form, setForm] = useState<FormState>({
        regNumber: '',
        date: '',
        time: TIME_SLOTS[0].value,
        name: '',
        phone: '',
        email: '',
        vehicleMake: '',
        vehicleModel: '',
        kmReading: '',
        location: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!dealerId) {
            setError('Dealer account is not ready. Please call the showroom directly.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const carServiceTypeMap: Record<string, string> = {
                'Periodic Service': 'periodic_service',
                'AC Service': 'ac_service',
                'Tyre & Alignment': 'tyre_alignment',
                'Accident Repair': 'accident_repair',
            };
            const vehicleServiceTypeMap: Record<string, string> = {
                'Periodic Service': 'general_service',
                'Oil Change': 'oil_change',
                'Tyre Check': 'tyre',
                'Breakdown Repair': 'repair',
                'CNG Kit Service': 'general_service',
                'Body Repair': 'repair',
            };
            const endpoint = vehicleType === '2w'
                ? '/api/two-wheelers/service-booking'
                : vehicleType === '3w'
                    ? '/api/three-wheelers/service-booking'
                    : '/api/car-service-bookings';

            const basePayload = {
                dealer_id: dealerId,
                customer_name: form.name,
                phone: form.phone,
                vehicle_make: form.vehicleMake || undefined,
                vehicle_model: form.vehicleModel || undefined,
                km_reading: form.kmReading ? Number(form.kmReading) : undefined,
                preferred_date: form.date,
                preferred_slot: form.time,
            };
            const payload = vehicleType === '2w' || vehicleType === '3w'
                ? {
                    ...basePayload,
                    service_type: vehicleServiceTypeMap[selectedService] ?? 'general_service',
                    ...(vehicleType === '3w' ? { vehicle_reg_no: form.regNumber || undefined } : {}),
                }
                : {
                    ...basePayload,
                    email: form.email,
                    vehicle_reg_no: form.regNumber || undefined,
                    service_type: carServiceTypeMap[selectedService] ?? 'periodic_service',
                    service_location: form.location || undefined,
                    notes: form.notes,
                };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Submission failed');
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Service Centre
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Book Your Service
                    </h2>
                    <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                        Schedule a service appointment at {dealerName} in just a few clicks.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Left — service type selector */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${brandColor}26` }}
                            >
                                <Wrench className="w-5 h-5" style={{ color: brandColor }} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Select Service Type</h3>
                                <p className="text-sm text-gray-600">Choose what you need done</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {serviceTypes.map((type) => {
                                const active = selectedService === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSelectedService(type)}
                                        className="rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all border"
                                        style={{
                                            backgroundColor: active ? `${brandColor}15` : 'white',
                                            borderColor: active ? brandColor : '#e5e7eb',
                                            color: active ? brandColor : '#374151',
                                        }}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {[
                                { tier: 'Basic', price: 'From ₹1,999', detail: 'Oil, filters, diagnostics' },
                                { tier: 'Premium', price: 'From ₹4,999', detail: 'Full inspection and AC check' },
                                { tier: 'Repair', price: 'Quote based', detail: 'Body, tyre, battery, insurance claim' },
                            ].map((item) => (
                                <div key={item.tier} className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: brandColor }}>{item.tier}</p>
                                    <p className="mt-1 text-lg font-bold text-gray-900">{item.price}</p>
                                    <p className="mt-1 text-xs text-gray-600">{item.detail}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
                            <h3 className="font-bold text-gray-900">Service Locations</h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {serviceLocations.slice(0, 4).map((location) => (
                                    <div key={location.name} className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-sm font-semibold text-gray-900">{location.name}</p>
                                        <p className="text-xs text-gray-600">{location.meta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why book with us */}
                        <div className="mt-8 space-y-3">
                            {[
                                'Brand-trained technicians',
                                'Genuine spare parts only',
                                'Free vehicle health check-up',
                                'Pick-up & drop service available',
                            ].map((point) => (
                                <div key={point} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: brandColor }} />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — booking form */}
                    <div
                        className="bg-white rounded-2xl p-6 md:p-8"
                        style={{ border: `1.5px solid ${brandColor}33` }}
                    >
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Appointment Booked!</h3>
                                <p className="text-gray-600 max-w-xs">
                                    We&apos;ve received your service request. Our team will confirm your appointment shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-5">
                                    Book Service Appointment
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Vehicle Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            name="regNumber"
                                            value={form.regNumber}
                                            onChange={handleChange}
                                            placeholder="e.g. MH 12 AB 1234"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 uppercase focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Make</label>
                                            <input
                                                type="text"
                                                name="vehicleMake"
                                                value={form.vehicleMake}
                                                onChange={handleChange}
                                                placeholder="e.g. Maruti Suzuki"
                                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                                style={{ ['--tw-ring-color' as string]: brandColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Model</label>
                                            <input
                                                type="text"
                                                name="vehicleModel"
                                                value={form.vehicleModel}
                                                onChange={handleChange}
                                                placeholder="e.g. Swift"
                                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                                style={{ ['--tw-ring-color' as string]: brandColor }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">KM Reading</label>
                                        <input
                                            type="number"
                                            name="kmReading"
                                            min="0"
                                            value={form.kmReading}
                                            onChange={handleChange}
                                            placeholder="Current odometer reading"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Preferred Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                min={getTodayDate()}
                                                value={form.date}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                                style={{ ['--tw-ring-color' as string]: brandColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Preferred Time
                                            </label>
                                            <select
                                                name="time"
                                                value={form.time}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                                style={{ ['--tw-ring-color' as string]: brandColor }}
                                            >
                                                {TIME_SLOTS.map((slot) => (
                                                    <option key={slot.value} value={slot.value}>
                                                        {slot.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Service Location
                                        </label>
                                        <select
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        >
                                            <option value="">Assign nearest location</option>
                                            {serviceLocations.map((location) => (
                                                <option key={location.name} value={location.name}>{location.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Preferred Location / Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            rows={3}
                                            value={form.notes}
                                            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                                            placeholder="Preferred hub, pickup request, service concern"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-500">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                        style={{ backgroundColor: brandColor }}
                                    >
                                        {submitting ? 'Booking…' : 'Book Service Appointment'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
