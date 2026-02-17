/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEALERSHIP WEBSITE TEMPLATE STYLES
 * 4 Professional Template Options for All Automotive Brands
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🎯 HOW IT WORKS:
 * - Clients select ONE of 4 template styles
 * - Brand colors are AUTOMATICALLY applied from brand guidelines
 * - Each template has its own unique design personality
 * - Same template can look completely different with Toyota vs BMW colors
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 TEMPLATE SELECTION (NOT COLOR SELECTION)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Clients DON'T choose colors - they choose the TEMPLATE STYLE.
 * Colors come from official brand guidelines in automotive-brands.ts
 *
 * Example:
 * - Toyota dealer selects "Luxury & Premium" → Gets luxury design with Toyota Red
 * - BMW dealer selects "Luxury & Premium" → Gets luxury design with BMW Blue
 * - Honda dealer selects "Family & Friendly" → Gets friendly design with Honda Red
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type TemplateStyle = 'luxury' | 'family' | 'sporty' | 'professional' | 'modern';

export interface TemplateConfig {
  id: TemplateStyle;
  name: string;
  icon: string;
  description: string;
  perfectFor: string;
  recommended?: boolean;

  // Visual characteristics
  design: {
    typography: {
      headingFont: string;
      bodyFont: string;
      headingWeight: number;
      bodyWeight: number;
      headingSize: 'large' | 'medium' | 'normal';
      letterSpacing: 'tight' | 'normal' | 'wide';
    };

    spacing: {
      sectionPadding: 'compact' | 'normal' | 'spacious';
      cardGap: 'small' | 'medium' | 'large';
      containerWidth: 'narrow' | 'normal' | 'wide' | 'full';
    };

    shapes: {
      borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
      cardStyle: 'flat' | 'shadow' | 'elevated' | 'bordered';
      buttonStyle: 'square' | 'rounded' | 'pill';
    };

    effects: {
      animations: 'minimal' | 'subtle' | 'dynamic';
      transitions: 'fast' | 'normal' | 'smooth';
      shadows: 'none' | 'soft' | 'medium' | 'dramatic';
      gradients: boolean;
    };

    layout: {
      headerStyle: 'minimal' | 'standard' | 'bold' | 'mega';
      heroStyle: 'simple' | 'split' | 'fullscreen' | 'carousel';
      gridColumns: 2 | 3 | 4;
      imageRatio: 'square' | 'landscape' | 'portrait';
    };
  };

  // Color usage strategy (uses brand colors differently)
  colorUsage: {
    primaryUsage: 'accent' | 'dominant' | 'balanced' | 'minimal';
    backgroundStyle: 'light' | 'mixed' | 'dark' | 'gradient';
    accentPlacement: 'headers' | 'buttons' | 'everywhere' | 'subtle';
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 1: LUXURY & PREMIUM ✨
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Elegant, sophisticated design with dark tones
 * Perfect for: BMW, Mercedes, Audi, Lexus, Porsche
 *
 * Design Characteristics:
 * - Large, dramatic typography
 * - Lots of white space
 * - Subtle animations
 * - Premium feel with elegant shadows
 * - Minimal color usage (let the brand color shine)
 */
export const luxuryTemplate: TemplateConfig = {
  id: 'luxury',
  name: 'Luxury & Premium',
  icon: '✨',
  description: 'Elegant, sophisticated design with dark tones',
  perfectFor: 'BMW, Mercedes, Audi, Lexus, Porsche',

  design: {
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      headingSize: 'large',
      letterSpacing: 'wide',
    },

    spacing: {
      sectionPadding: 'spacious',
      cardGap: 'large',
      containerWidth: 'normal',
    },

    shapes: {
      borderRadius: 'small',
      cardStyle: 'elevated',
      buttonStyle: 'square',
    },

    effects: {
      animations: 'subtle',
      transitions: 'smooth',
      shadows: 'dramatic',
      gradients: true,
    },

    layout: {
      headerStyle: 'minimal',
      heroStyle: 'fullscreen',
      gridColumns: 3,
      imageRatio: 'landscape',
    },
  },

  colorUsage: {
    primaryUsage: 'accent',
    backgroundStyle: 'dark',
    accentPlacement: 'subtle',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 2: FAMILY & FRIENDLY 👨‍👩‍👧‍👦
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Warm, welcoming design with friendly colors
 * Perfect for: Toyota, Honda, Subaru, Hyundai, Kia
 *
 * Design Characteristics:
 * - Rounded corners everywhere
 * - Bright, clean backgrounds
 * - Friendly, approachable typography
 * - Soft shadows
 * - Inviting color usage
 */
export const familyTemplate: TemplateConfig = {
  id: 'family',
  name: 'Family & Friendly',
  icon: '👨‍👩‍👧‍👦',
  description: 'Warm, welcoming design with friendly colors',
  perfectFor: 'Toyota, Honda, Subaru, Hyundai, Kia',
  recommended: true,

  design: {
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Open Sans, sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
      headingSize: 'medium',
      letterSpacing: 'normal',
    },

    spacing: {
      sectionPadding: 'normal',
      cardGap: 'medium',
      containerWidth: 'normal',
    },

    shapes: {
      borderRadius: 'large',
      cardStyle: 'shadow',
      buttonStyle: 'rounded',
    },

    effects: {
      animations: 'subtle',
      transitions: 'normal',
      shadows: 'soft',
      gradients: false,
    },

    layout: {
      headerStyle: 'standard',
      heroStyle: 'split',
      gridColumns: 3,
      imageRatio: 'landscape',
    },
  },

  colorUsage: {
    primaryUsage: 'balanced',
    backgroundStyle: 'light',
    accentPlacement: 'buttons',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 3: BOLD & SPORTY 🏎️
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dynamic, energetic design with vibrant colors
 * Perfect for: Sports cars, Performance brands, Dodge, Ford Performance
 *
 * Design Characteristics:
 * - Sharp angles and edges
 * - High contrast
 * - Dynamic animations
 * - Vibrant color usage
 * - Energetic layout
 */
export const sportyTemplate: TemplateConfig = {
  id: 'sporty',
  name: 'Bold & Sporty',
  icon: '🏎️',
  description: 'Dynamic, energetic design with vibrant colors',
  perfectFor: 'Sports cars, Performance brands',

  design: {
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      headingWeight: 800,
      bodyWeight: 400,
      headingSize: 'large',
      letterSpacing: 'tight',
    },

    spacing: {
      sectionPadding: 'compact',
      cardGap: 'small',
      containerWidth: 'wide',
    },

    shapes: {
      borderRadius: 'small',
      cardStyle: 'flat',
      buttonStyle: 'square',
    },

    effects: {
      animations: 'dynamic',
      transitions: 'fast',
      shadows: 'medium',
      gradients: true,
    },

    layout: {
      headerStyle: 'bold',
      heroStyle: 'fullscreen',
      gridColumns: 4,
      imageRatio: 'landscape',
    },
  },

  colorUsage: {
    primaryUsage: 'dominant',
    backgroundStyle: 'gradient',
    accentPlacement: 'everywhere',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 4: PROFESSIONAL & BUSINESS 💼
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Clean, trustworthy design for commercial focus
 * Perfect for: Trucks, Fleet sales, Commercial dealers
 *
 * Design Characteristics:
 * - Clean lines
 * - Professional typography
 * - Structured grid layout
 * - Conservative color usage
 * - Focus on information and trust
 */
export const professionalTemplate: TemplateConfig = {
  id: 'professional',
  name: 'Professional & Business',
  icon: '💼',
  description: 'Clean, trustworthy design for commercial focus',
  perfectFor: 'Trucks, Fleet sales, Commercial dealers',

  design: {
    typography: {
      headingFont: 'IBM Plex Sans, sans-serif',
      bodyFont: 'Source Sans Pro, sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
      headingSize: 'normal',
      letterSpacing: 'normal',
    },

    spacing: {
      sectionPadding: 'normal',
      cardGap: 'medium',
      containerWidth: 'wide',
    },

    shapes: {
      borderRadius: 'small',
      cardStyle: 'bordered',
      buttonStyle: 'rounded',
    },

    effects: {
      animations: 'minimal',
      transitions: 'fast',
      shadows: 'soft',
      gradients: false,
    },

    layout: {
      headerStyle: 'standard',
      heroStyle: 'simple',
      gridColumns: 3,
      imageRatio: 'square',
    },
  },

  colorUsage: {
    primaryUsage: 'minimal',
    backgroundStyle: 'light',
    accentPlacement: 'headers',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 5: MODERN & CLEAN 🔵
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Clean, contemporary design with blue tones
 * Perfect for: Any brand wanting a fresh, modern look
 *
 * Design Characteristics:
 * - Clean, modern typography
 * - Blue accent colors
 * - Balanced white space
 * - Subtle shadows
 * - Contemporary grid layouts
 */
export const modernTemplate: TemplateConfig = {
  id: 'modern' as TemplateStyle,
  name: 'Modern & Clean',
  icon: '🔵',
  description: 'Clean, contemporary design with blue tones',
  perfectFor: 'Any brand, Multi-brand dealerships',

  design: {
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      headingSize: 'medium',
      letterSpacing: 'normal',
    },

    spacing: {
      sectionPadding: 'normal',
      cardGap: 'medium',
      containerWidth: 'normal',
    },

    shapes: {
      borderRadius: 'medium',
      cardStyle: 'shadow',
      buttonStyle: 'rounded',
    },

    effects: {
      animations: 'subtle',
      transitions: 'normal',
      shadows: 'medium',
      gradients: true,
    },

    layout: {
      headerStyle: 'standard',
      heroStyle: 'split',
      gridColumns: 3,
      imageRatio: 'landscape',
    },
  },

  colorUsage: {
    primaryUsage: 'balanced',
    backgroundStyle: 'light',
    accentPlacement: 'buttons',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ALL TEMPLATES
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const allTemplates: TemplateConfig[] = [
  modernTemplate,
  luxuryTemplate,
  familyTemplate,
  sportyTemplate,
  professionalTemplate,
];

/**
 * Get template configuration by ID
 */
export function getTemplate(templateId: TemplateStyle): TemplateConfig {
  const template = allTemplates.find(t => t.id === templateId);
  if (!template) {
    return modernTemplate; // Default to modern & clean
  }
  return template;
}

/**
 * Get recommended template for a brand
 */
export function getRecommendedTemplate(brand: string): TemplateStyle {
  const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus'];
  const sportyBrands = ['Mazda', 'Nissan'];
  const professionalBrands = ['Ford']; // Especially for truck-focused dealers

  if (luxuryBrands.includes(brand)) return 'luxury';
  if (sportyBrands.includes(brand)) return 'sporty';
  if (professionalBrands.includes(brand)) return 'professional';

  return 'family'; // Default for most brands
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE USAGE EXAMPLES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Example 1: Toyota dealer selects "Family & Friendly"
 * → Uses family template design + Toyota Red (#EB0A1E)
 * → Rounded corners, friendly feel, Toyota brand colors
 *
 * Example 2: BMW dealer selects "Luxury & Premium"
 * → Uses luxury template design + BMW Blue (#1C69D4)
 * → Elegant typography, spacious layout, BMW brand colors
 *
 * Example 3: Honda dealer selects "Bold & Sporty"
 * → Uses sporty template design + Honda Red (#CC0000)
 * → Dynamic layout, energetic feel, Honda brand colors
 *
 * The SAME template can work with ANY brand because:
 * - Template defines the DESIGN (layout, typography, spacing)
 * - Brand provides the COLORS (primary, secondary, accent)
 * - They combine to create a unique website
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
