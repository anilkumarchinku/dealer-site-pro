"use client";

import { Car } from "@/lib/types/car";
import { formatPrice } from "@/lib/utils/car-utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface InventoryTableProps {
    cars: Car[];
    onEdit?: (car: Car) => void;
    onDelete?: (car: Car) => void;
    onView?: (car: Car) => void;
}

export function InventoryTable({ cars, onEdit, onDelete, onView }: InventoryTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Car | 'price' | 'year'; direction: 'asc' | 'desc' } | null>(null);

    const sortedCars = [...cars].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any = a[sortConfig.key as keyof Car];
        let bValue: any = b[sortConfig.key as keyof Car];

        if (sortConfig.key === 'price') {
            aValue = a.pricing.exShowroom.min;
            bValue = b.pricing.exShowroom.min;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key: keyof Car | 'price' | 'year') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="w-full overflow-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-4 py-3 min-w-[300px]">Vehicle</th>
                        <th
                            className="px-4 py-3 cursor-pointer hover:bg-muted/70 transition-colors select-none"
                            onClick={() => requestSort('price')}
                        >
                            Price {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="px-4 py-3 cursor-pointer hover:bg-muted/70 transition-colors select-none"
                            onClick={() => requestSort('year')}
                        >
                            Year {sortConfig?.key === 'year' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {sortedCars.map((car) => (
                        <tr key={car.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={car.images.hero}
                                            alt={car.model}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{car.make} {car.model}</div>
                                        <div className="text-xs text-muted-foreground">{car.variant}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                                {formatPrice(car.pricing.exShowroom.min)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {car.year}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {car.bodyType}
                            </td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    In Stock
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" onClick={() => onView?.(car)}>
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-500/10" onClick={() => onEdit?.(car)}>
                                        <Edit className="w-4 h-4 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-500/10" onClick={() => onDelete?.(car)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {sortedCars.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                No vehicles found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
