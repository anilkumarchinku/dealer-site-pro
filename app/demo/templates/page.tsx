'use client';

import { useState } from 'react';
import { allTemplates, type TemplateStyle } from '@/lib/templates';
import { getBrandColors } from '@/lib/colors/automotive-brands';

/**
 * Template Demo Page
 * Shows all 4 template styles with live brand color previews
 */

const DEMO_BRANDS = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Nissan',
  'Hyundai',
  'Volkswagen',
  'Mazda',
  'Subaru',
  'Kia',
  'Lexus',
  'Acura',
  'Audi',
];

export default function TemplateDemoPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('family');
  const [selectedBrand, setSelectedBrand] = useState('Toyota');

  const brandColors = getBrandColors(selectedBrand);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Template & Brand Preview System
          </h1>
          <p className="text-gray-600">
            4 Templates × 15 Brands = 60 Unique Website Combinations
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Brand Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1️⃣ Select Brand
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_BRANDS.map((brand) => {
                const colors = getBrandColors(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedBrand === brand
                        ? 'shadow-lg text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={
                      selectedBrand === brand
                        ? {
                            backgroundColor: colors.primary,
                          }
                        : {}
                    }
                  >
                    {brand}
                  </button>
                );
              })}
            </div>

            {/* Brand Colors Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {selectedBrand} Official Colors:
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div
                    className="w-full h-12 rounded mb-1 border border-gray-300"
                    style={{ backgroundColor: brandColors.primary }}
                  />
                  <p className="font-mono text-gray-600">Primary</p>
                  <p className="font-mono text-gray-500">{brandColors.primary}</p>
                </div>
                <div>
                  <div
                    className="w-full h-12 rounded mb-1 border border-gray-300"
                    style={{ backgroundColor: brandColors.secondary }}
                  />
                  <p className="font-mono text-gray-600">Secondary</p>
                  <p className="font-mono text-gray-500">{brandColors.secondary}</p>
                </div>
                <div>
                  <div
                    className="w-full h-12 rounded mb-1 border border-gray-300"
                    style={{ backgroundColor: brandColors.accent }}
                  />
                  <p className="font-mono text-gray-600">Accent</p>
                  <p className="font-mono text-gray-500">{brandColors.accent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2️⃣ Select Template Style
            </h2>
            <div className="space-y-3">
              {allTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{template.name}</h3>
                        {template.recommended && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            3️⃣ Live Preview: {selectedBrand} × {allTemplates.find(t => t.id === selectedTemplate)?.name}
          </h2>

          {/* Template Preview */}
          <TemplatePreview brand={selectedBrand} templateId={selectedTemplate} />
        </div>

        {/* Template Details */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Template Specs */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📋 Template Specifications
            </h3>
            {(() => {
              const template = allTemplates.find(t => t.id === selectedTemplate)!;
              return (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Typography:</span>
                    <span className="font-medium text-gray-900">
                      {template.design.typography.headingFont.split(',')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Border Radius:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.design.shapes.borderRadius}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spacing:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.design.spacing.sectionPadding}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shadows:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.design.effects.shadows}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Animations:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.design.effects.animations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hero Style:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.design.layout.heroStyle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grid Columns:</span>
                    <span className="font-medium text-gray-900">
                      {template.design.layout.gridColumns} columns
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Color Usage Strategy */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🎨 Color Usage Strategy
            </h3>
            {(() => {
              const template = allTemplates.find(t => t.id === selectedTemplate)!;
              return (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Usage:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.colorUsage.primaryUsage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Background Style:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.colorUsage.backgroundStyle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accent Placement:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {template.colorUsage.accentPlacement}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Perfect for brands like:</p>
                    <p className="font-medium text-gray-900">{template.perfectFor}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Template Preview Component
 * Shows a miniature version of what the template looks like
 */
function TemplatePreview({ brand, templateId }: { brand: string; templateId: TemplateStyle }) {
  const colors = getBrandColors(brand);

  // Different preview layouts based on template
  const getPreviewLayout = () => {
    switch (templateId) {
      case 'luxury':
        return (
          <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black p-6 flex justify-between items-center">
              <div className="text-2xl font-bold">{brand}</div>
              <div className="flex gap-4 text-sm">
                <span>New</span>
                <span>Used</span>
                <span>Service</span>
              </div>
            </div>

            {/* Hero - Fullscreen style */}
            <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="text-center space-y-6 px-8">
                <h1
                  className="text-6xl font-bold tracking-wide"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Luxury Redefined
                </h1>
                <p className="text-xl text-gray-300">Experience the ultimate in automotive excellence</p>
                <button
                  className="px-8 py-4 rounded-none font-semibold transition-all duration-500 shadow-2xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  Explore Collection
                </button>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="p-12 space-y-8">
              <h2 className="text-3xl font-bold text-center">Featured Vehicles</h2>
              <div className="grid grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                    <div className="h-48 bg-gray-700"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">2024 Model</h3>
                      <p className="text-gray-400 mb-4">$XX,XXX</p>
                      <button
                        className="w-full py-3 rounded-none font-medium transition-opacity duration-500 hover:opacity-90"
                        style={{ backgroundColor: colors.primary }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'family':
        return (
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b p-6 flex justify-between items-center">
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {brand}
              </div>
              <div className="flex gap-6 text-sm font-medium text-gray-600">
                <span>New</span>
                <span>Used</span>
                <span>Service</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Hero - Split style */}
            <div className="grid md:grid-cols-2 gap-12 p-12 bg-gray-50">
              <div className="flex flex-col justify-center space-y-6">
                <h1
                  className="text-5xl font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif', color: colors.primary }}
                >
                  Welcome to Our Family
                </h1>
                <p className="text-xl text-gray-600">
                  Find the perfect vehicle for your family's adventures
                </p>
                <div className="flex gap-4">
                  <button
                    className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Shop Now
                  </button>
                  <button
                    className="px-8 py-4 rounded-lg font-semibold border-2 transition-all duration-300 hover:bg-opacity-10"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>

            {/* Vehicles Grid */}
            <div className="p-12">
              <h2 className="text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>
                Featured Vehicles
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gray-100"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">2024 Model</h3>
                      <p className="text-gray-600 mb-4">Starting at $XX,XXX</p>
                      <button
                        className="w-full py-3 rounded-lg font-semibold text-white transition-all"
                        style={{ backgroundColor: colors.primary }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sporty':
        return (
          <div className={`rounded-lg overflow-hidden bg-gradient-to-br ${colors.gradient}`}>
            {/* Header */}
            <div className="bg-black/50 backdrop-blur p-6 flex justify-between items-center text-white">
              <div className="text-2xl font-black tracking-tight">{brand}</div>
              <div className="flex gap-6 text-sm font-bold uppercase">
                <span>Performance</span>
                <span>Racing</span>
                <span>Shop</span>
              </div>
            </div>

            {/* Hero - Fullscreen style */}
            <div className="h-96 flex items-center justify-center text-white">
              <div className="text-center space-y-6 px-8">
                <h1
                  className="text-7xl font-black tracking-tight"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  UNLEASH POWER
                </h1>
                <p className="text-2xl font-bold">Maximum Performance. Zero Compromise.</p>
                <button className="px-12 py-5 bg-white text-black rounded-none font-black text-lg transition-transform duration-200 hover:-translate-y-1 shadow-2xl">
                  EXPLORE NOW
                </button>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="p-12 bg-black text-white">
              <h2 className="text-4xl font-black text-center mb-8 tracking-tight">
                PERFORMANCE LINEUP
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-900 rounded-none overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-200">
                    <div className="h-40 bg-gray-800"></div>
                    <div className="p-4">
                      <h3 className="text-lg font-black mb-1">2024 SPORT</h3>
                      <p className="text-gray-400 text-sm mb-3">FROM $XX,XXX</p>
                      <button
                        className="w-full py-2 rounded-none font-bold text-sm transition-all"
                        style={{ backgroundColor: colors.primary }}
                      >
                        DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-white border-b p-6 flex justify-between items-center">
              <div className="text-2xl font-semibold text-gray-900">{brand}</div>
              <div className="flex gap-6 text-sm font-medium text-gray-700">
                <span>Fleet</span>
                <span>Commercial</span>
                <span>Service</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Hero - Simple style */}
            <div className="p-12 text-center bg-gray-50">
              <h1
                className="text-4xl font-semibold mb-4"
                style={{ fontFamily: 'IBM Plex Sans, sans-serif', color: colors.primary }}
              >
                Professional Fleet Solutions
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Trusted by businesses nationwide for reliable commercial vehicles
              </p>
              <button
                className="px-10 py-4 rounded-lg font-semibold text-white transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                Request Quote
              </button>
            </div>

            {/* Vehicles Grid */}
            <div className="p-12">
              <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900">
                Commercial Vehicles
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="h-48 bg-gray-50"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">2024 Model</h3>
                      <p className="text-gray-600 mb-4">Starting at $XX,XXX</p>
                      <button
                        className="w-full py-3 rounded-lg font-semibold border-2 transition-all"
                        style={{ borderColor: colors.primary, color: colors.primary }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="border-4 border-gray-200 rounded-xl overflow-hidden">{getPreviewLayout()}</div>;
}
