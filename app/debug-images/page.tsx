"use client";
import { allCars } from "@/lib/data/cars";
import Image from "next/image";

export default function DebugImagesPage() {
    const glanza = allCars.find(c => c.model.toLowerCase().includes('glanza'));
    const toyotaCars = allCars.filter(c => c.make === 'Toyota');

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">Debug Images</h1>

            <section>
                <h2 className="text-xl font-semibold">Glanza Check</h2>
                {glanza ? (
                    <div className="border p-4 rounded bg-gray-50">
                        <p><strong>Model:</strong> {glanza.make} {glanza.model}</p>
                        <p><strong>Hero Path:</strong> <code>{glanza.images.hero}</code></p>
                        <p><strong>Is Truthy?</strong> {glanza.images.hero ? 'Yes' : 'No'}</p>

                        <div className="flex gap-8 mt-4">
                            <div>
                                <p className="mb-2">Standard &lt;img&gt; tag:</p>
                                <img src={glanza.images.hero} alt="Standard HTML" className="w-64 h-auto border border-red-500" />
                            </div>

                            <div>
                                <p className="mb-2">Next.js &lt;Image&gt; tag:</p>
                                <div className="relative w-64 h-48 border border-blue-500">
                                    <Image
                                        src={glanza.images.hero}
                                        alt="NextJS Component"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">Glanza not found in allCars!</p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold">All Toyota Paths</h2>
                <ul className="list-disc pl-5">
                    {toyotaCars.map(c => (
                        <li key={c.id}>
                            {c.model}: <code>{c.images.hero}</code>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
