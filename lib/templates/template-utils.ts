/**
 * Template Utility Functions
 * Combines template styles with brand colors
 */

import { getBrandColors } from '../colors/automotive-brands';
import { getTemplate, type TemplateStyle } from './template-styles';

/**
 * Generate complete CSS classes for a template + brand combination
 */
export function getTemplateClasses(brand: string, templateId: TemplateStyle) {
  const template = getTemplate(templateId);
  const brandColors = getBrandColors(brand);

  // Base typography classes
  const typography = {
    heading: `font-[${template.design.typography.headingFont}] font-${template.design.typography.headingWeight} tracking-${template.design.typography.letterSpacing}`,
    body: `font-[${template.design.typography.bodyFont}] font-${template.design.typography.bodyWeight}`,
    headingSize:
      template.design.typography.headingSize === 'large'
        ? 'text-5xl md:text-6xl'
        : template.design.typography.headingSize === 'medium'
          ? 'text-4xl md:text-5xl'
          : 'text-3xl md:text-4xl',
  };

  // Spacing classes
  const spacing = {
    section:
      template.design.spacing.sectionPadding === 'spacious'
        ? 'py-20 md:py-32'
        : template.design.spacing.sectionPadding === 'compact'
          ? 'py-12 md:py-16'
          : 'py-16 md:py-24',
    cardGap:
      template.design.spacing.cardGap === 'large'
        ? 'gap-8'
        : template.design.spacing.cardGap === 'small'
          ? 'gap-4'
          : 'gap-6',
    container:
      template.design.spacing.containerWidth === 'wide'
        ? 'max-w-7xl'
        : template.design.spacing.containerWidth === 'narrow'
          ? 'max-w-5xl'
          : template.design.spacing.containerWidth === 'full'
            ? 'max-w-full'
            : 'max-w-6xl',
  };

  // Shape classes
  const shapes = {
    borderRadius:
      template.design.shapes.borderRadius === 'large'
        ? 'rounded-2xl'
        : template.design.shapes.borderRadius === 'medium'
          ? 'rounded-xl'
          : template.design.shapes.borderRadius === 'small'
            ? 'rounded-lg'
            : template.design.shapes.borderRadius === 'full'
              ? 'rounded-full'
              : 'rounded-none',
    button:
      template.design.shapes.buttonStyle === 'pill'
        ? 'rounded-full'
        : template.design.shapes.buttonStyle === 'rounded'
          ? 'rounded-lg'
          : 'rounded-none',
    card:
      template.design.shapes.cardStyle === 'elevated'
        ? 'shadow-2xl'
        : template.design.shapes.cardStyle === 'shadow'
          ? 'shadow-lg'
          : template.design.shapes.cardStyle === 'bordered'
            ? 'border-2'
            : '',
  };

  // Transition classes
  const effects = {
    transition:
      template.design.effects.transitions === 'smooth'
        ? 'transition-all duration-500'
        : template.design.effects.transitions === 'fast'
          ? 'transition-all duration-200'
          : 'transition-all duration-300',
    shadow:
      template.design.effects.shadows === 'dramatic'
        ? 'shadow-2xl'
        : template.design.effects.shadows === 'medium'
          ? 'shadow-lg'
          : template.design.effects.shadows === 'soft'
            ? 'shadow-md'
            : 'shadow-none',
  };

  return {
    typography,
    spacing,
    shapes,
    effects,
    brandColors,
  };
}

/**
 * Generate primary button classes for template + brand
 */
export function getPrimaryButtonClasses(brand: string, templateId: TemplateStyle): string {
  const template = getTemplate(templateId);
  const brandColors = getBrandColors(brand);

  const baseClasses = `px-8 py-4 font-semibold ${template.design.shapes.buttonStyle === 'pill' ? 'rounded-full' : template.design.shapes.buttonStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'} ${template.design.effects.transitions === 'smooth' ? 'transition-all duration-500' : 'transition-all duration-300'}`;

  // Different color usage based on template
  if (template.colorUsage.primaryUsage === 'dominant') {
    return `${baseClasses} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`;
  } else if (template.colorUsage.primaryUsage === 'minimal') {
    return `${baseClasses} bg-white border-2 hover:bg-[${brandColors.lightGray}]`;
  } else {
    return `${baseClasses} text-white hover:opacity-90`;
  }
}

/**
 * Generate secondary button classes for template + brand
 */
export function getSecondaryButtonClasses(brand: string, templateId: TemplateStyle): string {
  const template = getTemplate(templateId);
  const brandColors = getBrandColors(brand);

  const baseClasses = `px-8 py-4 font-semibold ${template.design.shapes.buttonStyle === 'pill' ? 'rounded-full' : template.design.shapes.buttonStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'} ${template.design.effects.transitions === 'smooth' ? 'transition-all duration-500' : 'transition-all duration-300'}`;

  return `${baseClasses} bg-transparent border-2 hover:bg-opacity-10`;
}

/**
 * Generate card classes for template
 */
export function getCardClasses(brand: string, templateId: TemplateStyle): string {
  const template = getTemplate(templateId);

  const borderRadius =
    template.design.shapes.borderRadius === 'large'
      ? 'rounded-2xl'
      : template.design.shapes.borderRadius === 'medium'
        ? 'rounded-xl'
        : template.design.shapes.borderRadius === 'small'
          ? 'rounded-lg'
          : 'rounded-none';

  const cardShadow =
    template.design.shapes.cardStyle === 'elevated'
      ? 'shadow-2xl hover:shadow-3xl'
      : template.design.shapes.cardStyle === 'shadow'
        ? 'shadow-lg hover:shadow-xl'
        : template.design.shapes.cardStyle === 'bordered'
          ? 'border-2 hover:border-opacity-70'
          : 'border';

  return `${borderRadius} ${cardShadow} bg-white overflow-hidden transition-all duration-300`;
}

/**
 * Get background style for template
 */
export function getBackgroundClasses(brand: string, templateId: TemplateStyle): string {
  const template = getTemplate(templateId);
  const brandColors = getBrandColors(brand);

  if (template.colorUsage.backgroundStyle === 'dark') {
    return 'bg-gray-900 text-white';
  } else if (template.colorUsage.backgroundStyle === 'gradient') {
    return `bg-gradient-to-br ${brandColors.gradient}`;
  } else if (template.colorUsage.backgroundStyle === 'mixed') {
    return `bg-[${brandColors.lightGray}]`;
  } else {
    return 'bg-white';
  }
}

/**
 * Get grid layout classes
 */
export function getGridClasses(templateId: TemplateStyle): string {
  const template = getTemplate(templateId);

  const columns = template.design.layout.gridColumns;
  const gap =
    template.design.spacing.cardGap === 'large'
      ? 'gap-8'
      : template.design.spacing.cardGap === 'small'
        ? 'gap-4'
        : 'gap-6';

  return `grid grid-cols-1 md:grid-cols-${Math.min(2, columns)} lg:grid-cols-${columns} ${gap}`;
}

/**
 * Generate hero section classes
 */
export function getHeroClasses(brand: string, templateId: TemplateStyle): string {
  const template = getTemplate(templateId);

  if (template.design.layout.heroStyle === 'fullscreen') {
    return 'min-h-screen flex items-center justify-center';
  } else if (template.design.layout.heroStyle === 'split') {
    return 'grid md:grid-cols-2 gap-12 items-center py-20';
  } else if (template.design.layout.heroStyle === 'carousel') {
    return 'relative h-[600px] overflow-hidden';
  } else {
    return 'py-20 text-center';
  }
}

/**
 * Generate complete template configuration
 */
export function generateTemplateConfig(brand: string, templateId: TemplateStyle) {
  const template = getTemplate(templateId);
  const brandColors = getBrandColors(brand);

  return {
    template,
    brandColors,
    classes: getTemplateClasses(brand, templateId),
    components: {
      primaryButton: getPrimaryButtonClasses(brand, templateId),
      secondaryButton: getSecondaryButtonClasses(brand, templateId),
      card: getCardClasses(brand, templateId),
      background: getBackgroundClasses(brand, templateId),
      grid: getGridClasses(templateId),
      hero: getHeroClasses(brand, templateId),
    },
  };
}
