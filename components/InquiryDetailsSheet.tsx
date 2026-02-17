
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
import { CalendarIcon, Clock, Car, Wrench, Phone, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CarModel } from "@/lib/data/car-models";

interface InquiryDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    brandName: string;
    brandColor: string;
    availableCars: CarModel[];
    initialTab?: string;
}

export function InquiryDetailsSheet({
    isOpen,
    onClose,
    brandName,
    brandColor,
    availableCars,
    initialTab = "test-drive"
}: InquiryDetailsSheetProps) {
    const [date, setDate] = useState<Date>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send data to backend
        alert("Inquiry submitted successfully! We will contact you soon.");
        onClose();
    };

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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500">
                                <Car className="w-4 h-4" />
                                <span>Schedule a Test Drive</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Vehicle</Label>
                                <Select required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a car model..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCars.map(car => (
                                            <SelectItem key={car.id} value={car.id}>
                                                {car.name}
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
                                    <Select>
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
                                <Input placeholder="John Doe" required />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input type="tel" placeholder="+91 98765 43210" required />
                            </div>

                            <Button type="submit" className="w-full mt-4" style={{ backgroundColor: brandColor }}>
                                Book Test Drive
                            </Button>
                        </form>
                    </TabsContent>

                    {/* SERVICE FORM */}
                    <TabsContent value="service">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500">
                                <Wrench className="w-4 h-4" />
                                <span>Book a Service Appointment</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Service Type</Label>
                                <Select required>
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
                                <Input placeholder="e.g. Tata Nexon 2022" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Preferred Date</Label>
                                    <div className="border rounded-md p-2 text-sm text-gray-500">
                                        Calender picker...
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <Select>
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
                                <Input type="tel" placeholder="+91..." required />
                            </div>

                            <Button type="submit" className="w-full mt-4" style={{ backgroundColor: brandColor }}>
                                Schedule Service
                            </Button>
                        </form>
                    </TabsContent>

                    {/* CALL BACK FORM */}
                    <TabsContent value="callback">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500">
                                <Phone className="w-4 h-4" />
                                <span>Request a Call Back</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input placeholder="Your Name" required />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input type="tel" placeholder="+91..." required />
                            </div>

                            <div className="space-y-2">
                                <Label>Best time to call?</Label>
                                <Select>
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
                                <Textarea placeholder="I'm interested in..." />
                            </div>

                            <Button type="submit" className="w-full" style={{ backgroundColor: brandColor }}>
                                Request Call
                            </Button>
                        </form>
                    </TabsContent>

                    {/* ACCESSORIES FORM */}
                    <TabsContent value="accessories">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Buy Genuine Accessories</span>
                            </div>

                            <div className="space-y-2">
                                <Label>Car Model</Label>
                                <Select required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your car..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCars.map(car => (
                                            <SelectItem key={car.id} value={car.id}>
                                                {car.name}
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
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input placeholder="Your Name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input type="tel" placeholder="+91..." required />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" style={{ backgroundColor: brandColor }}>
                                Check Availability
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
