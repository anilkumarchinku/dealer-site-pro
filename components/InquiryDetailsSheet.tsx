
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Car, Wrench, Phone, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Car as CarType } from "@/lib/types/car";
import { normalizeLeadPhone, validateLeadForm, hasLeadFormErrors } from "@/lib/validations/lead";

interface InquiryDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    brandName: string;
    brandColor: string;
    availableCars: CarType[];
    initialTab?: string;
    /**
     * Dealer ID — REQUIRED by /api/leads to persist the lead. Optional in the prop
     * signature only because some legacy call sites don't pass it yet; when missing,
     * submission is blocked with an inline error (see GAP note below).
     */
    dealerId?: string;
}

/** Builds a YYYY-MM-DD string from local date parts (avoids UTC off-by-one). */
function toLocalDateStr(date: Date | undefined): string {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function InquiryDetailsSheet({
    isOpen,
    onClose,
    brandName,
    brandColor,
    availableCars,
    initialTab = "test-drive",
    dealerId,
}: InquiryDetailsSheetProps) {
    const [date, setDate] = useState<Date>();

    // ── Test Drive form ──
    const [tdCarId, setTdCarId] = useState("");
    const [tdTime, setTdTime] = useState("");
    const [tdName, setTdName] = useState("");
    const [tdPhone, setTdPhone] = useState("");

    // ── Service form ──
    const [svcType, setSvcType] = useState("");
    const [svcModel, setSvcModel] = useState("");
    const [svcTime, setSvcTime] = useState("");
    const [svcPhone, setSvcPhone] = useState("");

    // ── Callback form ──
    const [cbName, setCbName] = useState("");
    const [cbPhone, setCbPhone] = useState("");
    const [cbTime, setCbTime] = useState("");
    const [cbMessage, setCbMessage] = useState("");

    // ── Accessories form ──
    const [accCarId, setAccCarId] = useState("");
    const [accParts, setAccParts] = useState("");
    const [accName, setAccName] = useState("");
    const [accPhone, setAccPhone] = useState("");

    // Per-form submission status keyed by tab value.
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});
    const [successMsg, setSuccessMsg] = useState<Record<string, string>>({});

    const carNameById = (id: string) => {
        const c = availableCars.find((car) => car.id === id);
        return c ? `${c.make} ${c.model}` : "";
    };

    /**
     * Shared submit: validates name/phone, then POSTs to /api/leads using the
     * standard payload shape (dealer_id, name, phone, email, message, lead_source).
     */
    const submitLead = async (
        source: string,
        params: {
            leadSource: string;
            name: string;
            phone: string;
            carId?: string;
            carName?: string;
            messageLines: (string | undefined)[];
            successText: string;
        }
    ) => {
        setErrorMsg((e) => ({ ...e, [source]: "" }));
        setSuccessMsg((s) => ({ ...s, [source]: "" }));

        // GAP: /api/leads requires a valid dealer_id (UUID) — this component is not
        // currently given one by all call sites. Block + flag instead of silently failing.
        if (!dealerId) {
            setErrorMsg((e) => ({
                ...e,
                [source]: "Unable to submit right now. Please call us directly.",
            }));
            return;
        }

        const normalizedPhone = normalizeLeadPhone(params.phone);
        const errors = validateLeadForm({ name: params.name, phone: normalizedPhone }, { requireConsent: false });
        if (hasLeadFormErrors(errors)) {
            setErrorMsg((e) => ({
                ...e,
                [source]: Object.values(errors).filter(Boolean).join(". "),
            }));
            return;
        }

        const message = params.messageLines.filter(Boolean).join("\n") || undefined;

        setSubmitting(source);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: params.name.trim(),
                    phone: normalizedPhone,
                    message,
                    car_id: params.carId || undefined,
                    car_name: params.carName || undefined,
                    lead_source: params.leadSource,
                }),
            });

            if (res.ok) {
                setSuccessMsg((s) => ({ ...s, [source]: params.successText }));
            } else {
                const body = await res.json().catch(() => null);
                setErrorMsg((e) => ({
                    ...e,
                    [source]:
                        body?.error ||
                        (res.status === 429
                            ? "Too many requests. Please wait a few minutes and try again."
                            : "Something went wrong. Please try again or call us directly."),
                }));
            }
        } catch (err) {
            console.error("Inquiry submission error:", err);
            setErrorMsg((e) => ({
                ...e,
                [source]: "Network error. Please check your connection and try again.",
            }));
        } finally {
            setSubmitting(null);
        }
    };

    const handleTestDrive = (e: React.FormEvent) => {
        e.preventDefault();
        submitLead("test-drive", {
            leadSource: "test_drive",
            name: tdName,
            phone: tdPhone,
            carId: tdCarId,
            carName: carNameById(tdCarId),
            messageLines: [
                "Test drive request",
                tdCarId ? `Vehicle: ${carNameById(tdCarId)}` : undefined,
                date ? `Preferred date: ${toLocalDateStr(date)}` : undefined,
                tdTime ? `Preferred time: ${tdTime}` : undefined,
            ],
            successText: "Test drive request sent! We'll call you to confirm.",
        });
    };

    const handleService = (e: React.FormEvent) => {
        e.preventDefault();
        submitLead("service", {
            leadSource: "service_maintenance",
            name: svcModel ? `Service — ${svcModel}` : "Service enquiry",
            phone: svcPhone,
            messageLines: [
                "Service appointment request",
                svcType ? `Service type: ${svcType}` : undefined,
                svcModel ? `Vehicle: ${svcModel}` : undefined,
                svcTime ? `Preferred time: ${svcTime}` : undefined,
            ],
            successText: "Service request sent! Our team will reach out shortly.",
        });
    };

    const handleCallback = (e: React.FormEvent) => {
        e.preventDefault();
        submitLead("callback", {
            leadSource: "phone",
            name: cbName,
            phone: cbPhone,
            messageLines: [
                "Callback request",
                cbTime ? `Best time to call: ${cbTime}` : undefined,
                cbMessage.trim() || undefined,
            ],
            successText: "Callback requested! We'll ring you back soon.",
        });
    };

    const handleAccessories = (e: React.FormEvent) => {
        e.preventDefault();
        submitLead("accessories", {
            leadSource: "parts_accessories",
            name: accName,
            phone: accPhone,
            carId: accCarId,
            carName: carNameById(accCarId),
            messageLines: [
                "Accessories enquiry",
                accCarId ? `Vehicle: ${carNameById(accCarId)}` : undefined,
                accParts.trim() ? `Parts/Accessories: ${accParts.trim()}` : undefined,
            ],
            successText: "Enquiry sent! We'll check availability and get back to you.",
        });
    };

    const Status = ({ tab }: { tab: string }) => (
        <>
            {errorMsg[tab] && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg[tab]}</p>
            )}
            {successMsg[tab] && (
                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">{successMsg[tab]}</p>
            )}
        </>
    );

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold" style={{ color: brandColor }}>
                        How can we help you?
                    </SheetTitle>
                    <SheetDescription>
                        Choose an option below to connect with {brandName}.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue={initialTab} key={isOpen ? `open-${initialTab}` : 'closed'} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="test-drive" className="text-xs sm:text-sm">Test Drive</TabsTrigger>
                        <TabsTrigger value="service" className="text-xs sm:text-sm">Service</TabsTrigger>
                        <TabsTrigger value="callback" className="text-xs sm:text-sm">Call Back</TabsTrigger>
                        <TabsTrigger value="accessories" className="text-xs sm:text-sm">Accessories</TabsTrigger>
                    </TabsList>

                    {/* TEST DRIVE FORM */}
                    <TabsContent value="test-drive">
                        <form onSubmit={handleTestDrive} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
                                <Car className="w-4 h-4" />
                                <span>Schedule a Test Drive</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Vehicle</Label>
                                <Select required value={tdCarId} onValueChange={setTdCarId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a car model..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCars.map(car => (
                                            <SelectItem key={car.id} value={car.id}>
                                                {car.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Preferred Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Preferred Time</Label>
                                    <Select value={tdTime} onValueChange={setTdTime}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Time slot..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                                            <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                                            <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Your Name</Label>
                                <Input
                                    placeholder="John Doe"
                                    required
                                    value={tdName}
                                    onChange={(e) => setTdName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    required
                                    value={tdPhone}
                                    onChange={(e) => setTdPhone(e.target.value)}
                                />
                            </div>

                            <Status tab="test-drive" />

                            <Button
                                type="submit"
                                className="w-full mt-4"
                                style={{ backgroundColor: brandColor }}
                                disabled={submitting === "test-drive"}
                            >
                                {submitting === "test-drive" ? "Sending…" : "Book Test Drive"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* SERVICE FORM */}
                    <TabsContent value="service">
                        <form onSubmit={handleService} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
                                <Wrench className="w-4 h-4" />
                                <span>Book a Service Appointment</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Service Type</Label>
                                <Select required value={svcType} onValueChange={setSvcType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="What do you need?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="periodic">Periodic Maintenance</SelectItem>
                                        <SelectItem value="repair">General Repair</SelectItem>
                                        <SelectItem value="body">Body Shop / Denting-Painting</SelectItem>
                                        <SelectItem value="inspection">General Inspection</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Vehicle Model</Label>
                                <Input
                                    placeholder="e.g. Tata Nexon 2022"
                                    required
                                    value={svcModel}
                                    onChange={(e) => setSvcModel(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Preferred Date</Label>
                                    {/* TODO: wire a real date picker for the service form (reuse the
                                        Popover+Calendar above). Date is currently captured via the
                                        Test Drive picker only; left as-is to avoid scope creep. */}
                                    <div className="border rounded-md p-2 text-sm text-gray-600">
                                        Calender picker...
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <Select value={svcTime} onValueChange={setSvcTime}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Time..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Morning</SelectItem>
                                            <SelectItem value="afternoon">Afternoon</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Contact Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    required
                                    value={svcPhone}
                                    onChange={(e) => setSvcPhone(e.target.value)}
                                />
                            </div>

                            <Status tab="service" />

                            <Button
                                type="submit"
                                className="w-full mt-4"
                                style={{ backgroundColor: brandColor }}
                                disabled={submitting === "service"}
                            >
                                {submitting === "service" ? "Sending…" : "Schedule Service"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* CALL BACK FORM */}
                    <TabsContent value="callback">
                        <form onSubmit={handleCallback} className="space-y-5">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>Request a Call Back</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    placeholder="Your Name"
                                    required
                                    value={cbName}
                                    onChange={(e) => setCbName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    required
                                    value={cbPhone}
                                    onChange={(e) => setCbPhone(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Best time to call?</Label>
                                <Select value={cbTime} onValueChange={setCbTime}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asap">Immediately (ASAP)</SelectItem>
                                        <SelectItem value="morning">Morning (9-12)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12-5)</SelectItem>
                                        <SelectItem value="evening">Evening (5-8)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>What is this regarding?</Label>
                                <Textarea
                                    placeholder="I'm interested in..."
                                    value={cbMessage}
                                    onChange={(e) => setCbMessage(e.target.value)}
                                />
                            </div>

                            <Status tab="callback" />

                            <Button
                                type="submit"
                                className="w-full"
                                style={{ backgroundColor: brandColor }}
                                disabled={submitting === "callback"}
                            >
                                {submitting === "callback" ? "Sending…" : "Request Call"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* ACCESSORIES FORM */}
                    <TabsContent value="accessories">
                        <form onSubmit={handleAccessories} className="space-y-5">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Buy Genuine Accessories</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Car Model</Label>
                                <Select required value={accCarId} onValueChange={setAccCarId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your car..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCars.map(car => (
                                            <SelectItem key={car.id} value={car.id}>
                                                {car.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Parts / Accessories needed</Label>
                                <Textarea
                                    placeholder="e.g. Seat covers, floor mats, alloys..."
                                    className="min-h-[100px]"
                                    required
                                    value={accParts}
                                    onChange={(e) => setAccParts(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        placeholder="Your Name"
                                        required
                                        value={accName}
                                        onChange={(e) => setAccName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        required
                                        value={accPhone}
                                        onChange={(e) => setAccPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Status tab="accessories" />

                            <Button
                                type="submit"
                                className="w-full"
                                style={{ backgroundColor: brandColor }}
                                disabled={submitting === "accessories"}
                            >
                                {submitting === "accessories" ? "Sending…" : "Check Availability"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
