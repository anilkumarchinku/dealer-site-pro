/**
 * Template Validation & Restrictions
 * Prevents bad brand + template combinations and provides smart warnings
 */

import type { Brand, StyleTemplate } from '../types';

export interface CombinationScore {
  score: number;
  quality: 'perfect' | 'excellent' | 'good' | 'mediocre' | 'clash';
  message: string;
  recommendation?: StyleTemplate;
  shouldBlock: boolean;
  shouldWarn: boolean;
}

/**
 * Blocked combinations - Never allow these (score <= 4)
 * Indian Market Specific Restrictions
 */
const BLOCKED_COMBINATIONS: Array<{ brand: Brand; template: StyleTemplate; reason: string }> = [
  {
    brand: 'Mercedes-Benz',
    template: 'professional',
    reason: 'Luxury brand loses prestige on conservative business template. Mercedes requires the Luxury template.'
  },
  {
    brand: 'BMW',
    template: 'professional',
    reason: 'BMW\'s premium positioning doesn\'t work with conservative business template. Use Luxury template.'
  },
  {
    brand: 'Maruti Suzuki',
    template: 'luxury',
    reason: 'Maruti Suzuki is India\'s mass-market leader known for value and affordability, not luxury. Use Family template.'
  },
];

/**
 * Warned combinations - Allow but show strong warning (score = 5)
 * Indian Market Specific Warnings
 */
const WARNED_COMBINATIONS: Array<{ brand: Brand; template: StyleTemplate; reason: string; alternative: StyleTemplate }> = [
  {
    brand: 'Maruti Suzuki',
    template: 'sporty',
    reason: 'Maruti Suzuki is India\'s family car leader known for reliability and value, not aggressive performance.',
    alternative: 'family'
  },
  {
    brand: 'Tata Motors',
    template: 'sporty',
    reason: 'Tata Motors\' value and safety positioning works better with Family template for most models.',
    alternative: 'family'
  },
  {
    brand: 'Toyota',
    template: 'sporty',
    reason: 'Toyota\'s friendly family positioning doesn\'t match aggressive sporty design.',
    alternative: 'family'
  },
  {
    brand: 'Honda',
    template: 'sporty',
    reason: 'Honda is known for approachable reliability, not aggressive performance.',
    alternative: 'family'
  },
  {
    brand: 'Volkswagen',
    template: 'sporty',
    reason: 'VW\'s German engineering precision doesn\'t align with high-energy sporty template.',
    alternative: 'family'
  },
  {
    brand: 'Hyundai',
    template: 'sporty',
    reason: 'Hyundai\'s value positioning doesn\'t match premium sports template.',
    alternative: 'family'
  },
  {
    brand: 'Audi',
    template: 'professional',
    reason: 'Audi\'s innovative luxury positioning is lost on conservative business template.',
    alternative: 'luxury'
  },
  {
    brand: 'Force Motors',
    template: 'luxury',
    reason: 'Force Motors specializes in commercial and utility vehicles, not luxury. Use Professional template.',
    alternative: 'professional'
  },
];

/**
 * Suboptimal combinations - Show gentle suggestion (score = 6-7)
 * Indian Market Specific Suggestions
 */
const SUBOPTIMAL_COMBINATIONS: Array<{ brand: Brand; template: StyleTemplate; suggestion: string; better: StyleTemplate }> = [
  // Luxury brands on wrong templates
  {
    brand: 'Mercedes-Benz',
    template: 'family',
    suggestion: 'Mercedes buyers expect elegance, not friendly approachability.',
    better: 'luxury'
  },
  {
    brand: 'BMW',
    template: 'family',
    suggestion: 'BMW\'s "Ultimate Driving Machine" positioning works better with Luxury template.',
    better: 'luxury'
  },
  {
    brand: 'Lexus',
    template: 'family',
    suggestion: 'Lexus luxury is better showcased with the Luxury template.',
    better: 'luxury'
  },
  {
    brand: 'Audi',
    template: 'family',
    suggestion: 'Audi\'s premium positioning is better served by the Luxury template.',
    better: 'luxury'
  },
  {
    brand: 'Volvo',
    template: 'family',
    suggestion: 'Volvo\'s Scandinavian luxury and safety positioning fits Luxury template better.',
    better: 'luxury'
  },
  // Mass market brands on luxury template
  {
    brand: 'Honda',
    template: 'luxury',
    suggestion: 'Honda is approachable and friendly, not premium luxury.',
    better: 'family'
  },
  {
    brand: 'Toyota',
    template: 'luxury',
    suggestion: 'Toyota\'s reliability and value positioning fits Family template better.',
    better: 'family'
  },
  {
    brand: 'Kia',
    template: 'luxury',
    suggestion: 'Kia\'s affordable positioning doesn\'t match luxury template elegance.',
    better: 'family'
  },
  {
    brand: 'Hyundai',
    template: 'luxury',
    suggestion: 'Hyundai\'s value positioning works best with the Family template.',
    better: 'family'
  },
  {
    brand: 'Tata Motors',
    template: 'luxury',
    suggestion: 'Tata Motors is known for value and reliability, best showcased with Family template.',
    better: 'family'
  },
  {
    brand: 'Renault',
    template: 'luxury',
    suggestion: 'Renault\'s affordable positioning doesn\'t align with luxury template.',
    better: 'family'
  },
  // Commercial brands on wrong templates
  {
    brand: 'Force Motors',
    template: 'family',
    suggestion: 'Force Motors specializes in commercial vehicles. Professional template works better.',
    better: 'professional'
  },
  {
    brand: 'Isuzu',
    template: 'family',
    suggestion: 'Isuzu is known for commercial trucks and SUVs. Try Professional template.',
    better: 'professional'
  },
];

/**
 * Perfect combinations - Actively recommend these (score = 10)
 * Indian Market Perfect Matches
 */
const PERFECT_COMBINATIONS: Array<{ brand: Brand; template: StyleTemplate }> = [
  // Luxury perfection
  { brand: 'BMW', template: 'luxury' },
  { brand: 'Mercedes-Benz', template: 'luxury' },
  { brand: 'Lexus', template: 'luxury' },
  { brand: 'Audi', template: 'luxury' },
  { brand: 'Jaguar', template: 'luxury' },
  { brand: 'Land Rover', template: 'luxury' },
  { brand: 'Volvo', template: 'luxury' },
  { brand: 'Porsche', template: 'luxury' },
  { brand: 'Bentley', template: 'luxury' },
  { brand: 'Lamborghini', template: 'luxury' },

  // Family perfection (Mass market leaders in India)
  { brand: 'Maruti Suzuki', template: 'family' },
  { brand: 'Tata Motors', template: 'family' },
  { brand: 'Toyota', template: 'family' },
  { brand: 'Honda', template: 'family' },
  { brand: 'Hyundai', template: 'family' },
  { brand: 'Kia', template: 'family' },
  { brand: 'Renault', template: 'family' },
  { brand: 'Volkswagen', template: 'family' },
  { brand: 'Skoda', template: 'family' },
  { brand: 'BYD', template: 'family' },
  // Sporty perfection
  { brand: 'MG', template: 'sporty' },
  { brand: 'Nissan', template: 'sporty' },
  { brand: 'Mahindra', template: 'sporty' }, // For sporty SUVs like XUV
  { brand: 'Jeep', template: 'sporty' }, // Adventure/sporty positioning
  { brand: 'Citroen', template: 'sporty' },
  { brand: 'Tesla', template: 'sporty' },

  // Professional perfection (Commercial vehicles)
  { brand: 'Force Motors', template: 'professional' },
  { brand: 'Isuzu', template: 'professional' },
];

/**
 * Validate a brand + template combination
 */
export function validateCombination(brand: Brand, template: StyleTemplate): CombinationScore {
  // Check if blocked
  const blocked = BLOCKED_COMBINATIONS.find(
    c => c.brand === brand && c.template === template
  );
  if (blocked) {
    return {
      score: 4,
      quality: 'clash',
      message: blocked.reason,
      recommendation: getRecommendedTemplate(brand),
      shouldBlock: true,
      shouldWarn: false
    };
  }

  // Check if warned
  const warned = WARNED_COMBINATIONS.find(
    c => c.brand === brand && c.template === template
  );
  if (warned) {
    return {
      score: 5,
      quality: 'mediocre',
      message: warned.reason,
      recommendation: warned.alternative,
      shouldBlock: false,
      shouldWarn: true
    };
  }

  // Check if suboptimal
  const suboptimal = SUBOPTIMAL_COMBINATIONS.find(
    c => c.brand === brand && c.template === template
  );
  if (suboptimal) {
    return {
      score: 6,
      quality: 'good',
      message: suboptimal.suggestion,
      recommendation: suboptimal.better,
      shouldBlock: false,
      shouldWarn: true
    };
  }

  // Check if perfect
  const perfect = PERFECT_COMBINATIONS.find(
    c => c.brand === brand && c.template === template
  );
  if (perfect) {
    return {
      score: 10,
      quality: 'perfect',
      message: `Perfect match! This combination showcases ${brand}'s brand perfectly.`,
      shouldBlock: false,
      shouldWarn: false
    };
  }

  // Default: good combination
  return {
    score: 7,
    quality: 'good',
    message: `This combination works well for ${brand}.`,
    shouldBlock: false,
    shouldWarn: false
  };
}

/**
 * Get recommended template for a brand
 * Indian Market Specific Recommendations
 */
export function getRecommendedTemplate(brand: Brand): StyleTemplate {
  const luxuryBrands: Brand[] = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Lexus',
    'Jaguar', 'Land Rover', 'Volvo', 'Porsche',
    'Bentley', 'Lamborghini'
  ];

  const sportyBrands: Brand[] = [
    'MG', 'Nissan', 'Mahindra', 'Jeep',
    'Citroen', 'Tesla'
  ];

  const professionalBrands: Brand[] = [
    'Force Motors', 'Isuzu'
  ];

  if (luxuryBrands.includes(brand)) return 'luxury';
  if (sportyBrands.includes(brand)) return 'sporty';
  if (professionalBrands.includes(brand)) return 'professional';

  return 'family'; // Default for mass market brands (Maruti Suzuki, Tata, Toyota, Honda, Hyundai, Kia, etc.)
}

/**
 * Get detailed recommendation with confidence level
 */
export interface TemplateRecommendation {
  template: StyleTemplate;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  alternativeTemplates?: Array<{ template: StyleTemplate; reason: string }>;
}

export function getSmartRecommendation(brands: Brand[]): TemplateRecommendation {
  if (!brands || brands.length === 0) {
    return {
      template: 'family',
      confidence: 'medium',
      reason: 'Family template is the most versatile option and works well for most dealerships.'
    };
  }

  const primaryBrand = brands[0];

  // Perfect matches - high confidence
  const perfectMatches: Record<string, TemplateRecommendation> = {
    'BMW': {
      template: 'luxury',
      confidence: 'high',
      reason: 'BMW\'s "Ultimate Driving Machine" positioning demands the sophisticated Luxury template.',
      alternativeTemplates: [
        { template: 'sporty', reason: 'For M-series specialists' }
      ]
    },
    'Mercedes-Benz': {
      template: 'luxury',
      confidence: 'high',
      reason: 'Mercedes-Benz is the pinnacle of luxury. The Luxury template showcases this prestige perfectly.',
    },
    'Lexus': {
      template: 'luxury',
      confidence: 'high',
      reason: 'Lexus represents Japanese luxury and craftsmanship, ideal for the Luxury template.',
    },
    'Audi': {
      template: 'luxury',
      confidence: 'high',
      reason: 'Audi\'s progressive luxury positioning is perfectly captured by the Luxury template.',
      alternativeTemplates: [
        { template: 'sporty', reason: 'For S/RS performance line specialists' }
      ]
    },
    'Toyota': {
      template: 'family',
      confidence: 'high',
      reason: 'Toyota\'s "Let\'s Go Places" friendly positioning is perfectly matched with the Family template.',
      alternativeTemplates: [
        { template: 'professional', reason: 'For Tacoma/Tundra truck-focused dealers' }
      ]
    },
    'Honda': {
      template: 'family',
      confidence: 'high',
      reason: 'Honda\'s reliability and approachability are best showcased with the Family template.',
    },
    'Hyundai': {
      template: 'family',
      confidence: 'high',
      reason: 'Hyundai\'s value and modern family focus aligns perfectly with the Family template.',
    },
    'Nissan': {
      template: 'sporty',
      confidence: 'high',
      reason: 'Nissan\'s GT-R and Z performance heritage shines with the Sporty template.',
      alternativeTemplates: [
        { template: 'family', reason: 'For Rogue/Pathfinder family SUV dealers' }
      ]
    },
    'Maruti Suzuki': {
      template: 'family',
      confidence: 'high',
      reason: 'Maruti Suzuki is India\'s family car leader, perfectly matched with the Family template.',
    },
    'Tata Motors': {
      template: 'family',
      confidence: 'high',
      reason: 'Tata Motors\' safety and value positioning is best showcased with the Family template.',
    },
    'Mahindra': {
      template: 'sporty',
      confidence: 'high',
      reason: 'Mahindra\'s SUV-focused adventure positioning fits the Sporty template.',
      alternativeTemplates: [
        { template: 'family', reason: 'For family-focused SUV dealers' }
      ]
    },
  };

  if (perfectMatches[primaryBrand]) {
    return perfectMatches[primaryBrand];
  }

  // Good matches - medium confidence
  const goodMatches: Record<string, TemplateRecommendation> = {
    'Kia': {
      template: 'family',
      confidence: 'medium',
      reason: 'Kia\'s modern value positioning works well with the Family template.',
    },
    'Volkswagen': {
      template: 'family',
      confidence: 'medium',
      reason: 'VW\'s "People\'s Car" heritage and approachability fit the Family template.',
      alternativeTemplates: [
        { template: 'professional', reason: 'For commercial/business focus' }
      ]
    },
    'Skoda': {
      template: 'family',
      confidence: 'medium',
      reason: 'Skoda\'s European engineering and value positioning fits the Family template.',
    },
    'MG': {
      template: 'sporty',
      confidence: 'medium',
      reason: 'MG\'s British heritage and modern design align with the Sporty template.',
    },
  };

  if (goodMatches[primaryBrand]) {
    return goodMatches[primaryBrand];
  }

  // Default recommendation
  return {
    template: 'family',
    confidence: 'medium',
    reason: 'The Family template is versatile and works well for most dealerships.',
  };
}

/**
 * Get all validation issues for a brand's template selection
 */
export function getAllCombinationScores(brand: Brand): Record<StyleTemplate, CombinationScore> {
  const templates: StyleTemplate[] = ['luxury', 'family', 'sporty', 'professional'];
  const scores: Record<string, CombinationScore> = {};

  templates.forEach(template => {
    scores[template] = validateCombination(brand, template);
  });

  return scores as Record<StyleTemplate, CombinationScore>;
}

/**
 * Check if a combination should show performance line question
 */
export function shouldAskAboutPerformanceLine(brand: Brand, template: StyleTemplate): boolean {
  // Ask if selecting sporty template for brands that have performance variants
  const performanceVariants: Partial<Record<Brand, string[]>> = {
    'Toyota': ['GR Supra', 'GR Yaris'],
    'BMW': ['M-Series'],
    'Mercedes-Benz': ['AMG'],
    'Audi': ['S-Line', 'RS'],
    'Nissan': ['GT-R', 'Z'],
    'Hyundai': ['N Line'],
    'Kia': ['GT Line'],
    'Mahindra': ['XUV700'],
    'Tata Motors': ['Nexon EV'],
  };

  return template === 'sporty' && brand in performanceVariants;
}

/**
 * Check if a combination should ask about fleet/commercial focus
 */
export function shouldAskAboutFleetFocus(brand: Brand, template: StyleTemplate): boolean {
  const fleetBrands: Brand[] = ['Toyota', 'Tata Motors', 'Mahindra', 'Force Motors', 'Isuzu'];
  return template === 'professional' && fleetBrands.includes(brand);
}
