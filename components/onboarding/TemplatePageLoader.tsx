'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './template-animations.css';
import type { Brand, StyleTemplate } from '@/lib/types';
import { automotiveBrands } from '@/lib/colors/automotive-brands';

interface TemplatePageLoaderProps {
  brand: Brand;
  template: StyleTemplate;
  onComplete?: () => void;
}

/**
 * TemplatePageLoader - Shows branded animations when template pages load
 *
 * Animations by template:
 * - Luxury: Zoom animation with brand logo
 * - Family: Shape morphing with brand logo
 * - Sporty: Swipe animation with brand logo
 * - Professional: Fade animation with brand logo
 */
export function TemplatePageLoader({ brand, template, onComplete }: TemplatePageLoaderProps) {
  const [show, setShow] = useState(true);
  const [animationClass, setAnimationClass] = useState('');
  const [logoClass, setLogoClass] = useState('');

  useEffect(() => {
    // Set animation classes based on template
    switch (template) {
      case 'luxury':
        setAnimationClass('luxury-template-animation');
        setLogoClass('luxury-logo-animation');
        break;
      case 'family':
        setAnimationClass('family-template-animation');
        setLogoClass('family-logo-animation');
        break;
      case 'sporty':
        setAnimationClass('sporty-template-animation');
        setLogoClass('sporty-logo-animation');
        break;
      case 'professional':
        setAnimationClass('professional-template-animation');
        setLogoClass('professional-logo-animation');
        break;
    }

    // Hide after animation completes
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [template, onComplete]);

  if (!show) return null;

  // Get brand info - automotiveBrands is an object with brand names as keys
  const brandColors = automotiveBrands[brand as keyof typeof automotiveBrands];
  const brandColor = brandColors?.primary || '#3B82F6';

  // Format brand name for logo file path
  const brandLogoPath = brand.toLowerCase().replace(/\s+/g, '-');

  // Get background gradient based on template
  const getBackgroundGradient = () => {
    switch (template) {
      case 'luxury':
        return 'from-amber-900 via-slate-900 to-black';
      case 'family':
        return 'from-blue-900 via-slate-900 to-black';
      case 'sporty':
        return 'from-red-900 via-slate-900 to-black';
      case 'professional':
        return 'from-gray-900 via-slate-900 to-black';
      default:
        return 'from-slate-900 via-slate-800 to-black';
    }
  };

  return (
    <div
      className={`page-load-overlay fade-out bg-gradient-to-br ${getBackgroundGradient()}`}
      style={{
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className={`logo-animation-container ${animationClass}`}>
        <div
          className={logoClass}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 0 40px ${brandColor}80) drop-shadow(0 0 80px ${brandColor}40)`,
          }}
        >
          {/* Brand Logo PNG */}
          <Image
            src={`/assets/logos/${brandLogoPath}.png`}
            alt={`${brand} logo`}
            width={300}
            height={300}
            className="object-contain"
            priority
            key={`${brand}-${template}`}
          />
        </div>
      </div>

      {/* Template Name */}
      <div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-2xl font-semibold"
        style={{
          animation: 'professionalFade 1s ease-out 0.5s forwards',
          opacity: 0,
        }}
      >
        {template.charAt(0).toUpperCase() + template.slice(1)} Template
      </div>
    </div>
  );
}

/**
 * Hook to trigger page load animation
 * Use this in your preview pages
 */
export function useTemplatePageAnimation(brand: Brand, template: StyleTemplate) {
  // Start with animation showing and content hidden
  const [showAnimation, setShowAnimation] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure animation shows and content is hidden
    setShowAnimation(true);
    setIsReady(false);

    // After animation completes, show content
    const timer = setTimeout(() => {
      setShowAnimation(false);
      // Small delay before showing content for smooth transition
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    }, 2000);

    return () => clearTimeout(timer);
  }, [brand, template]);

  return { showAnimation, isReady };
}
