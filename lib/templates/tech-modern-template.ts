/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 5: TECH & MODERN 🔌 (EV/Futuristic)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ultra-clean minimalist design for electric and tech-forward dealerships
 * Perfect for: Tesla competitors, EV dealers, Genesis, Polestar, Rivian
 *
 * Design Characteristics:
 * - Clean minimalism with lots of white space
 * - Electric blue/teal accents
 * - Futuristic sans-serif fonts
 * - Smooth, fluid animations
 * - Data visualization friendly
 * - Tech specs showcase
 */

import type { TemplateConfig } from './template-styles';

export const techModernTemplate: TemplateConfig = {
  id: 'tech-modern' as any, // Will extend TemplateStyle type
  name: 'Tech & Modern',
  icon: '🔌',
  description: 'Clean, futuristic design for electric and innovative brands',
  perfectFor: 'Tesla, EV dealers, Genesis, Polestar, tech-forward brands',

  design: {
    typography: {
      headingFont: 'Space Grotesk, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      headingSize: 'large',
      letterSpacing: 'tight',
    },

    spacing: {
      sectionPadding: 'spacious',
      cardGap: 'large',
      containerWidth: 'wide',
    },

    shapes: {
      borderRadius: 'medium',
      cardStyle: 'flat',
      buttonStyle: 'rounded',
    },

    effects: {
      animations: 'subtle',
      transitions: 'smooth',
      shadows: 'none',
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
    backgroundStyle: 'light',
    accentPlacement: 'subtle',
  },
};

/**
 * Tech-specific color palette recommendations
 */
export const techColorPalette = {
  electric: {
    primary: '#0EA5E9', // Electric Blue
    secondary: '#14B8A6', // Teal
    accent: '#06B6D4', // Cyan
    background: '#FFFFFF',
    text: '#0F172A',
  },
  minimal: {
    primary: '#000000', // Pure Black
    secondary: '#3B82F6', // Bright Blue
    accent: '#8B5CF6', // Purple
    background: '#FFFFFF',
    text: '#1E293B',
  },
  green: {
    primary: '#10B981', // Green
    secondary: '#059669', // Dark Green
    accent: '#34D399', // Light Green
    background: '#FFFFFF',
    text: '#064E3B',
  },
};

/**
 * Tech-specific components and widgets
 */
export const techComponents = {
  // Range calculator widget
  rangeCalculator: {
    enabled: true,
    metrics: ['battery_kwh', 'range_miles', 'charge_time'],
  },

  // Performance metrics display
  performanceMetrics: {
    enabled: true,
    metrics: ['0_60_mph', 'top_speed', 'horsepower', 'torque'],
  },

  // Charging network map
  chargingMap: {
    enabled: true,
    providers: ['Tesla Supercharger', 'Electrify America', 'ChargePoint'],
  },

  // Environmental impact calculator
  environmentalImpact: {
    enabled: true,
    metrics: ['co2_saved', 'gas_savings', 'environmental_score'],
  },

  // Technology features showcase
  techFeatures: {
    enabled: true,
    features: [
      'Autopilot/FSD',
      'OTA Updates',
      'Mobile App Control',
      'Advanced Safety',
      'Connectivity',
    ],
  },

  // Comparison tool
  comparisonTool: {
    enabled: true,
    compareAgainst: ['gas', 'hybrid', 'other_ev'],
  },
};

/**
 * Special features for EV dealers
 */
export const evDealerFeatures = {
  // Incentives calculator
  incentivesCalculator: {
    federal: true, // Federal tax credit
    state: true, // State incentives
    utility: true, // Utility rebates
    hov: true, // HOV lane access
  },

  // Home charging setup
  homeChargingInfo: {
    installation: true,
    costs: true,
    electricianReferrals: true,
  },

  // Test drive scheduler with range demo
  testDrive: {
    rangeDemo: true, // Demonstrate actual range
    chargingDemo: true, // Show charging process
    techDemo: true, // Technology features walkthrough
  },
};

/**
 * Example brands that would use this template
 */
export const techModernBrands = [
  'Tesla',
  'Rivian',
  'Lucid',
  'Polestar',
  'Genesis',
  'BMW (i-series)',
  'Mercedes (EQ)',
  'Audi (e-tron)',
  'Ford (Lightning)',
  'Porsche (Taycan)',
];

/**
 * CSS classes specific to tech/modern template
 */
export const techModernClasses = {
  // Hero section with video background
  hero: 'min-h-screen flex items-center justify-center relative overflow-hidden',
  heroOverlay: 'absolute inset-0 bg-gradient-to-b from-transparent to-black/30',
  heroContent: 'relative z-10 text-center',

  // Minimalist cards
  card: 'bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100',

  // Tech specs display
  specsGrid: 'grid grid-cols-2 md:grid-cols-4 gap-6',
  specItem: 'text-center',
  specValue: 'text-4xl font-bold mb-2',
  specLabel: 'text-sm text-gray-600 uppercase tracking-wide',

  // Futuristic buttons
  primaryButton:
    'px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30',
  secondaryButton:
    'px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all duration-300',

  // Data visualization container
  dataViz: 'bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8',

  // Feature showcase
  featureGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  featureCard:
    'bg-white rounded-xl p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300',

  // Comparison table
  comparisonTable: 'w-full bg-white rounded-2xl overflow-hidden shadow-lg',
  comparisonRow: 'border-b border-gray-100 hover:bg-gray-50 transition-colors',

  // Range indicator
  rangeIndicator: 'flex items-center gap-3',
  rangeBadge:
    'px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold',
};

/**
 * Animation configurations for tech template
 */
export const techAnimations = {
  // Smooth fade in
  fadeIn: 'animate-fadeIn duration-700 ease-out',

  // Slide up
  slideUp: 'animate-slideUp duration-500 ease-out',

  // Pulse for charging indicators
  pulse: 'animate-pulse',

  // Smooth transitions
  smooth: 'transition-all duration-500 ease-in-out',

  // Hover lift
  hoverLift: 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300',
};

/**
 * Content suggestions for EV dealers
 */
export const evContentSuggestions = {
  heroHeadlines: [
    'The Future of Driving is Electric',
    'Zero Emissions. Infinite Possibilities.',
    'Experience Electric Performance',
    'Sustainable Luxury, Redefined',
  ],

  callsToAction: [
    'Calculate Your Savings',
    'Schedule a Test Drive',
    'Explore Incentives',
    'Configure Your EV',
    'Compare Models',
  ],

  trustSignals: [
    'Federal Tax Credit Eligible',
    'Free Home Charging Consultation',
    'Lifetime Battery Warranty',
    'Zero-Emission Vehicle',
    'Advanced Safety Technology',
  ],
};
