/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEMPLATE 6: RUGGED & ADVENTURE 🏔️ (Outdoor/Off-road)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Outdoor-focused design for adventure and off-road brands
 * Perfect for: Jeep, Land Rover, Subaru (adventure focus), outdoor lifestyle dealers
 *
 * Design Characteristics:
 * - Earthy, natural color palettes
 * - Rugged textures and patterns
 * - Adventure lifestyle photography
 * - Bold, sturdy typography
 * - Outdoor-inspired design elements
 * - Capability showcase focus
 */

import type { TemplateConfig } from './template-styles';

export const ruggedAdventureTemplate: TemplateConfig = {
  id: 'adventure' as any, // Will extend TemplateStyle type
  name: 'Rugged & Adventure',
  icon: '🏔️',
  description: 'Outdoor-focused design for adventure and off-road brands',
  perfectFor: 'Jeep, Land Rover, Subaru, outdoor lifestyle dealers',

  design: {
    typography: {
      headingFont: 'Oswald, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      headingSize: 'large',
      letterSpacing: 'normal',
    },

    spacing: {
      sectionPadding: 'normal',
      cardGap: 'medium',
      containerWidth: 'wide',
    },

    shapes: {
      borderRadius: 'small',
      cardStyle: 'elevated',
      buttonStyle: 'square',
    },

    effects: {
      animations: 'minimal',
      transitions: 'fast',
      shadows: 'medium',
      gradients: false,
    },

    layout: {
      headerStyle: 'bold',
      heroStyle: 'fullscreen',
      gridColumns: 3,
      imageRatio: 'landscape',
    },
  },

  colorUsage: {
    primaryUsage: 'balanced',
    backgroundStyle: 'mixed',
    accentPlacement: 'buttons',
  },
};

/**
 * Rugged-specific color palettes
 */
export const ruggedColorPalette = {
  forest: {
    primary: '#1A4D2E', // Forest Green
    secondary: '#2E7D32', // Medium Green
    accent: '#8B4513', // Saddle Brown
    background: '#F5F5DC', // Beige
    text: '#2C3E50',
  },
  mountain: {
    primary: '#4A5568', // Slate Gray
    secondary: '#2D3748', // Charcoal
    accent: '#ED8936', // Orange
    background: '#FFFFFF',
    text: '#1A202C',
  },
  desert: {
    primary: '#D4A574', // Sand
    secondary: '#8B7355', // Desert Brown
    accent: '#CD853F', // Peru
    background: '#FFF8DC', // Cornsilk
    text: '#4A3728',
  },
  wilderness: {
    primary: '#2F4538', // Hunter Green
    secondary: '#7C8B7E', // Moss Green
    accent: '#C4764E', // Terra Cotta
    background: '#F4F1E8', // Off White
    text: '#2C2416',
  },
};

/**
 * Adventure-specific components
 */
export const adventureComponents = {
  // Capability showcase
  capabilityShowcase: {
    enabled: true,
    features: [
      'towing_capacity',
      'ground_clearance',
      'water_fording',
      '4wd_system',
      'approach_departure_angles',
    ],
  },

  // Trail rating system
  trailRating: {
    enabled: true,
    ratings: ['beginner', 'intermediate', 'advanced', 'expert'],
  },

  // Adventure package builder
  packageBuilder: {
    enabled: true,
    packages: [
      'roof_rack',
      'winch',
      'rock_sliders',
      'skid_plates',
      'lift_kit',
      'all_terrain_tires',
      'recovery_gear',
    ],
  },

  // Terrain selector showcase
  terrainModes: {
    enabled: true,
    modes: ['snow', 'sand', 'mud', 'rock', 'auto'],
  },

  // Adventure stories/testimonials
  adventureStories: {
    enabled: true,
    categories: ['overlanding', 'camping', 'off-roading', 'exploration'],
  },

  // Location finder
  trailsFinder: {
    enabled: true,
    types: ['off_road_trails', 'camping_spots', 'scenic_routes'],
  },
};

/**
 * Outdoor lifestyle features
 */
export const outdoorFeatures = {
  // Gear integration
  gearGuide: {
    roofRacks: true,
    cargoSystems: true,
    campingGear: true,
    recoveryEquipment: true,
  },

  // Adventure planning
  adventurePlanning: {
    routePlanning: true,
    weatherIntegration: true,
    trailConditions: true,
  },

  // Community features
  community: {
    adventureClub: true,
    eventCalendar: true,
    photoGallery: true,
    forums: true,
  },

  // Vehicle preparation
  preparation: {
    preTrip: true,
    maintenanceSchedule: true,
    modifications: true,
  },
};

/**
 * Example brands that would use this template
 */
export const adventureBrands = [
  'Jeep',
  'Land Rover',
  'Subaru (Adventure)',
  'Toyota (4Runner, Tacoma)',
  'Ford (Bronco)',
  'GMC (AT4)',
  'Chevrolet (ZR2)',
  'Ram (Rebel)',
];

/**
 * CSS classes specific to adventure template
 */
export const adventureClasses = {
  // Hero with outdoor imagery
  hero: 'min-h-screen flex items-center justify-center relative bg-cover bg-center',
  heroOverlay: 'absolute inset-0 bg-gradient-to-b from-black/40 to-black/60',
  heroContent: 'relative z-10 text-white',

  // Rugged cards with texture
  card: 'bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-shadow',

  // Capability grid
  capabilityGrid: 'grid grid-cols-2 md:grid-cols-4 gap-6',
  capabilityItem:
    'bg-gradient-to-br from-green-50 to-white rounded-lg p-6 text-center border border-green-200',

  // Bold adventure buttons
  primaryButton:
    'px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-md uppercase tracking-wider transition-colors shadow-md',
  secondaryButton:
    'px-8 py-4 bg-white border-2 border-green-700 text-green-700 font-bold rounded-md uppercase tracking-wider hover:bg-green-50 transition-colors',

  // Trail rating badges
  trailBadge: {
    beginner: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold',
    intermediate:
      'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold',
    advanced: 'bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold',
    expert: 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold',
  },

  // Feature showcase
  featureShowcase:
    'bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-8 text-white',

  // Adventure gallery
  galleryGrid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  galleryItem:
    'aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md',

  // Stats display
  statsBar: 'flex flex-wrap gap-8 justify-center py-8 border-y border-green-200',
  statItem: 'text-center',
  statValue: 'text-4xl font-bold text-green-700',
  statLabel: 'text-sm text-gray-600 uppercase tracking-wide mt-2',

  // Terrain mode selector
  terrainModes: 'flex flex-wrap gap-3',
  terrainBadge:
    'px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md font-semibold cursor-pointer transition-colors',
};

/**
 * Texture and pattern options
 */
export const adventureTextures = {
  // Background patterns
  patterns: {
    topographic: 'url(/patterns/topographic-map.svg)',
    camouflage: 'url(/patterns/camo.svg)',
    woodGrain: 'url(/patterns/wood-grain.svg)',
    tireTread: 'url(/patterns/tire-tread.svg)',
  },

  // Image overlays
  overlays: {
    dirt: 'bg-blend-multiply opacity-10',
    paper: 'bg-blend-soft-light opacity-20',
    grunge: 'bg-blend-overlay opacity-15',
  },
};

/**
 * Content suggestions for adventure dealers
 */
export const adventureContentSuggestions = {
  heroHeadlines: [
    'Adventure Awaits',
    'Conquer Any Terrain',
    'Built for the Wild',
    'Your Journey Starts Here',
    'Explore Without Limits',
  ],

  callsToAction: [
    'Plan Your Adventure',
    'Explore Capabilities',
    'Join the Community',
    'Schedule Off-Road Demo',
    'Build Your Adventure Rig',
  ],

  trustSignals: [
    'Trail Rated',
    'Award-Winning 4WD',
    'Adventure-Tested',
    'Off-Road Champion',
    'Proven Capability',
  ],

  features: [
    '4x4 Capability',
    'All-Terrain Performance',
    'Towing Power',
    'Adventure Ready',
    'Rugged Durability',
    'Go Anywhere Confidence',
  ],
};

/**
 * Adventure-specific widgets
 */
export const adventureWidgets = {
  // Weather-resistant features highlight
  weatherProof: {
    enabled: true,
    features: ['waterproof_interior', 'rust_protection', 'sealed_electronics'],
  },

  // Modification compatibility
  modFriendly: {
    enabled: true,
    categories: ['suspension', 'armor', 'lighting', 'recovery', 'storage'],
  },

  // Real owner adventures
  ownerAdventures: {
    enabled: true,
    includePhotos: true,
    includeVideos: true,
    includeLocations: true,
  },

  // Capability calculator
  capabilityCalc: {
    enabled: true,
    inputs: ['vehicle_weight', 'cargo_weight', 'trailer_weight'],
    outputs: ['max_capacity', 'payload_remaining', 'tow_capacity_remaining'],
  },
};
