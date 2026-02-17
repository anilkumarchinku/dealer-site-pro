/**
 * Car Detail View
 * Comprehensive view for a single car
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CarCard } from './CarCard';
import { Download, Share2, Phone, Calendar, Shield, Fuel, Gauge } from 'lucide-react';

interface CarDetailViewProps {
    car: Car;
    similarCars?: Car[];
}

export function CarDetailView({ car, similarCars = [] }: CarDetailViewProps) {
    const [activeImage, setActiveImage] = useState(car.images.hero);

    const keySpecs = [
        { icon: <Fuel className="w-5 h-5" />, label: 'Fuel Type', value: car.engine.type },
        { icon: <Gauge className="w-5 h-5" />, label: 'Mileage', value: `${car.performance.fuelEfficiency} kmpl` },
        { icon: <Calendar className="w-5 h-5" />, label: 'Transmission', value: car.transmission.type },
        { icon: <Shield className="w-5 h-5" />, label: 'Safety', value: `${car.safety?.ncapRating?.stars || 'TBD'} Stars` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model}</h1>
                    <p className="text-gray-500 mt-1">{car.variant} • {car.year}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <div className="text-3xl font-bold text-gray-900">
                        {formatPriceInLakhs(car.pricing.exShowroom.min)}
                        {car.pricing.exShowroom.max !== car.pricing.exShowroom.min &&
                            ` - ${formatPriceInLakhs(car.pricing.exShowroom.max)}`
                        }
                    </div>
                    <p className="text-sm text-gray-500">Ex-showroom Price</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column: Images */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={car.model}
                                fill
                                className="object-contain"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                        )}

                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-2">
                        {[car.images.hero, ...car.images.exterior, ...car.images.interior].filter(Boolean).map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600' : 'border-transparent'
                                    }`}
                            >
                                <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Quick Stats & Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">Key Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {keySpecs.map((spec, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-gray-500 mb-1">{spec.icon}</div>
                                    <div className="text-xs text-gray-500">{spec.label}</div>
                                    <div className="font-semibold text-gray-900">{spec.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Interested?</h3>
                        <p className="text-blue-700 text-sm mb-4">Get the best offer for {car.model} today.</p>
                        <div className="space-y-3">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Dealer
                            </Button>
                            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100">
                                <Download className="w-4 h-4 mr-2" />
                                Download Brochure
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="specs" className="mb-12">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
                    <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">Specifications</TabsTrigger>
                    <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">Features</TabsTrigger>
                    <TabsTrigger value="variants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">Variants</TabsTrigger>
                </TabsList>

                <TabsContent value="specs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Engine & Transmission</h3>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Engine Type</TableCell>
                                        <TableCell>{car.engine.type}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Displacement</TableCell>
                                        <TableCell>{car.engine.displacement} cc</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Max Power</TableCell>
                                        <TableCell>{car.engine.power}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Max Torque</TableCell>
                                        <TableCell>{car.engine.torque}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Transmission</TableCell>
                                        <TableCell>{car.transmission.type}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Dimensions & Capacity</h3>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Length</TableCell>
                                        <TableCell>{car.dimensions.length || '-'} mm</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Width</TableCell>
                                        <TableCell>{car.dimensions.width || '-'} mm</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Height</TableCell>
                                        <TableCell>{car.dimensions.height || '-'} mm</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Boot Space</TableCell>
                                        <TableCell>{car.dimensions.bootSpace} Litres</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Fuel Tank</TableCell>
                                        <TableCell>{car.dimensions.fuelTankCapacity} Litres</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="features">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold mb-4">Key Features</h4>
                            <ul className="space-y-2">
                                {car.features.keyFeatures.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-green-500 mt-0.5">✓</span> {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* We can group other features if structured data is available */}
                    </div>
                </TabsContent>

                <TabsContent value="variants">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variant</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Transmission</TableHead>
                                <TableHead>Fuel</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {car.variants?.map((variant) => (
                                <TableRow key={variant.id}>
                                    <TableCell className="font-medium">{variant.name}</TableCell>
                                    <TableCell>{formatPriceInLakhs(variant.price)}</TableCell>
                                    <TableCell>{variant.transmission}</TableCell>
                                    <TableCell>{variant.fuelType}</TableCell>
                                </TableRow>
                            ))}
                            {(!car.variants || car.variants.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        Variant information not available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>

            {/* Similar Cars */}
            {similarCars.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {similarCars.map((simCar) => (
                            <CarCard key={simCar.id} car={simCar} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
