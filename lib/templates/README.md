# 4 Professional Website Templates for Automotive Dealerships

## Overview

This template system provides **4 distinct website styles** that work with **ALL automotive brands**. Clients select the TEMPLATE (design style), and their official BRAND COLORS are applied automatically.

---

## How It Works

### 🎯 The Key Concept

**Clients DON'T choose colors - they choose the TEMPLATE.**

- ✅ Colors come from official brand guidelines ([automotive-brands.ts](../colors/automotive-brands.ts))
- ✅ Templates define the design (layout, typography, spacing, visual style)
- ✅ Same template + different brands = unique websites

### Example Combinations

| Template | Brand | Result |
|----------|-------|--------|
| Luxury & Premium | BMW | Elegant design with BMW Blue |
| Luxury & Premium | Mercedes | Elegant design with Mercedes Black/Silver |
| Family & Friendly | Toyota | Warm design with Toyota Red |
| Family & Friendly | Honda | Warm design with Honda Red |
| Bold & Sporty | Mazda | Dynamic design with Mazda Red |
| Bold & Sporty | Nissan | Dynamic design with Nissan Red |
| Professional | Ford | Clean design with Ford Blue |

**4 Templates × 15 Brands = 60 unique website combinations!**

---

## The 4 Template Styles

### 1. ✨ Luxury & Premium

**Perfect for:** BMW, Mercedes, Audi, Lexus, Porsche

**Design Characteristics:**
- Large, dramatic typography (Playfair Display + Inter)
- Lots of white space
- Subtle, elegant animations
- Dark tones with minimal color usage
- Premium feel with dramatic shadows
- Fullscreen hero sections
- Elevated card style

**Color Usage:**
- Primary: Accent only (subtle, refined)
- Background: Dark theme
- Placement: Minimal, strategic

**Best For:** High-end luxury brands that want sophistication

---

### 2. 👨‍👩‍👧‍👦 Family & Friendly (⭐ Recommended)

**Perfect for:** Toyota, Honda, Subaru, Hyundai, Kia

**Design Characteristics:**
- Rounded corners everywhere
- Bright, clean backgrounds
- Friendly, approachable typography (Poppins + Open Sans)
- Soft shadows
- Inviting color usage
- Split hero sections
- Welcoming layout

**Color Usage:**
- Primary: Balanced throughout
- Background: Light, clean
- Placement: Buttons and CTAs

**Best For:** Family-oriented brands with broad appeal

---

### 3. 🏎️ Bold & Sporty

**Perfect for:** Sports cars, Performance brands, Mazda, Nissan

**Design Characteristics:**
- Sharp angles and edges
- High contrast design
- Dynamic animations (fast transitions)
- Vibrant color usage throughout
- Energetic, bold typography (Montserrat + Roboto)
- Compact spacing for intensity
- Gradient effects

**Color Usage:**
- Primary: Dominant presence
- Background: Gradient themes
- Placement: Everywhere (bold)

**Best For:** Performance vehicles and energetic brands

---

### 4. 💼 Professional & Business

**Perfect for:** Trucks, Fleet sales, Commercial dealers

**Design Characteristics:**
- Clean, structured lines
- Professional typography (IBM Plex Sans)
- Structured grid layouts
- Conservative color usage
- Focus on information and trust
- Minimal animations
- Bordered card style

**Color Usage:**
- Primary: Minimal (headers only)
- Background: Clean white/light
- Placement: Headers and accents

**Best For:** Commercial dealers, fleet sales, B2B focus

---

## Implementation

### 1. Select Template

```tsx
import { TemplateSelector } from '@/components/onboarding/TemplateSelector';

<TemplateSelector
  onSelect={(templateId) => {
    console.log('Selected template:', templateId);
  }}
  selectedTemplate="family"
/>
```

### 2. Generate Template Config

```tsx
import { generateTemplateConfig } from '@/lib/templates';

const config = generateTemplateConfig('Toyota', 'family');

// Access everything:
console.log(config.template);      // Template settings
console.log(config.brandColors);   // Toyota's official colors
console.log(config.classes);       // Pre-generated CSS classes
console.log(config.components);    // Component-specific classes
```

### 3. Use Template Classes

```tsx
import { getTemplateClasses, getPrimaryButtonClasses } from '@/lib/templates';

const classes = getTemplateClasses('Toyota', 'family');

// Typography
<h1 className={`${classes.typography.heading} ${classes.typography.headingSize}`}>
  Welcome to Our Dealership
</h1>

// Buttons
const buttonClass = getPrimaryButtonClasses('Toyota', 'family');
<button className={buttonClass} style={{ backgroundColor: config.brandColors.primary }}>
  Shop Now
</button>

// Cards
const cardClass = getCardClasses('Toyota', 'family');
<div className={cardClass}>
  {/* Card content */}
</div>
```

### 4. Apply Brand Colors

```tsx
import { getBrandColors } from '@/lib/colors/automotive-brands';

const toyotaColors = getBrandColors('Toyota');

// Use in styles
<div style={{ backgroundColor: toyotaColors.primary }}>
  <button style={{ backgroundColor: toyotaColors.hover }}>
    Click Me
  </button>
</div>
```

---

## Template Design Breakdown

### Typography

Each template uses different font combinations:

| Template | Heading Font | Body Font | Weight | Style |
|----------|--------------|-----------|--------|-------|
| Luxury | Playfair Display (serif) | Inter | Heavy (700) | Elegant |
| Family | Poppins | Open Sans | Medium (600) | Friendly |
| Sporty | Montserrat | Roboto | Bold (800) | Energetic |
| Professional | IBM Plex Sans | Source Sans Pro | Semi-bold (600) | Clean |

### Spacing

| Template | Section Padding | Card Gap | Container |
|----------|----------------|----------|-----------|
| Luxury | Spacious (py-32) | Large (gap-8) | Normal |
| Family | Normal (py-24) | Medium (gap-6) | Normal |
| Sporty | Compact (py-16) | Small (gap-4) | Wide |
| Professional | Normal (py-24) | Medium (gap-6) | Wide |

### Shapes & Effects

| Template | Border Radius | Card Style | Shadows | Animations |
|----------|--------------|------------|---------|------------|
| Luxury | Small | Elevated | Dramatic | Subtle |
| Family | Large (rounded) | Shadow | Soft | Subtle |
| Sporty | Small | Flat | Medium | Dynamic |
| Professional | Small | Bordered | Soft | Minimal |

### Layout Styles

| Template | Header | Hero | Grid | Image Ratio |
|----------|--------|------|------|-------------|
| Luxury | Minimal | Fullscreen | 3 columns | Landscape |
| Family | Standard | Split (50/50) | 3 columns | Landscape |
| Sporty | Bold | Fullscreen | 4 columns | Landscape |
| Professional | Standard | Simple | 3 columns | Square |

---

## Color Usage Strategy

Each template uses brand colors differently:

### Luxury & Premium
- **Primary Usage:** Accent only (10% of design)
- **Background:** Dark theme (black/dark gray)
- **Accent Placement:** Subtle touches, hover states
- **Philosophy:** Less is more, let quality speak

### Family & Friendly
- **Primary Usage:** Balanced (30% of design)
- **Background:** Light, clean whites
- **Accent Placement:** Buttons, CTAs, headings
- **Philosophy:** Welcoming and approachable

### Bold & Sporty
- **Primary Usage:** Dominant (50%+ of design)
- **Background:** Gradients with brand colors
- **Accent Placement:** Everywhere
- **Philosophy:** Make a statement

### Professional & Business
- **Primary Usage:** Minimal (15% of design)
- **Background:** Clean white/light gray
- **Accent Placement:** Headers and key elements
- **Philosophy:** Professional and trustworthy

---

## Recommended Templates by Brand

```tsx
import { getRecommendedTemplate } from '@/lib/templates';

const recommendedForBMW = getRecommendedTemplate('BMW');        // 'luxury'
const recommendedForToyota = getRecommendedTemplate('Toyota');  // 'family'
const recommendedForMazda = getRecommendedTemplate('Mazda');    // 'sporty'
const recommendedForFord = getRecommendedTemplate('Ford');      // 'professional'
```

**Automatic Recommendations:**
- Luxury Brands (BMW, Mercedes, Audi, Lexus) → Luxury & Premium
- Family Brands (Toyota, Honda, Subaru, Hyundai, Kia) → Family & Friendly
- Sporty Brands (Mazda, Nissan) → Bold & Sporty
- Commercial Focus (Ford trucks) → Professional & Business

---

## Complete Example

```tsx
'use client';

import { useState } from 'react';
import { generateTemplateConfig, TemplateStyle } from '@/lib/templates';

export default function DealerWebsite() {
  const brand = 'Toyota';
  const [template, setTemplate] = useState<TemplateStyle>('family');

  const config = generateTemplateConfig(brand, template);

  return (
    <div className={config.components.background}>
      {/* Hero Section */}
      <section className={config.components.hero}>
        <div className={`${config.classes.spacing.container} mx-auto px-4`}>
          <h1
            className={`${config.classes.typography.heading} ${config.classes.typography.headingSize}`}
            style={{ color: config.brandColors.primary }}
          >
            Welcome to Our Toyota Dealership
          </h1>

          <button
            className={config.components.primaryButton}
            style={{ backgroundColor: config.brandColors.primary }}
          >
            Shop Vehicles
          </button>

          <button
            className={config.components.secondaryButton}
            style={{ borderColor: config.brandColors.primary, color: config.brandColors.primary }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className={config.classes.spacing.section}>
        <div className={`${config.classes.spacing.container} mx-auto px-4`}>
          <div className={config.components.grid}>
            {/* Vehicle cards */}
            <div className={config.components.card}>
              <img src="/camry.jpg" alt="Camry" />
              <h3 className={config.classes.typography.heading}>2024 Camry</h3>
              <button
                style={{ backgroundColor: config.brandColors.primary }}
                className={config.components.primaryButton}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## Why This System Works

### ✅ Flexibility
- 4 templates × 15 brands = 60 unique combinations
- Each combination feels unique and professional

### ✅ Brand Consistency
- Official brand colors always used
- No off-brand color customizations
- Maintains manufacturer guidelines

### ✅ Design Quality
- Professional templates designed for each use case
- Optimized layouts and typography
- Consistent user experience

### ✅ Easy Selection
- Dealers choose style, not colors
- Simple decision process
- Clear recommendations

### ✅ Scalability
- Easy to add new templates
- Easy to add new brands
- Maintainable codebase

---

## File Structure

```
lib/templates/
├── template-styles.ts      # 4 template definitions
├── template-utils.ts       # Utility functions
├── index.ts               # Clean exports
└── README.md              # This file

components/onboarding/
└── TemplateSelector.tsx   # Template selection UI

lib/colors/
└── automotive-brands.ts   # Official brand colors (15 brands)
```

---

## Adding a New Template

1. Define template in `template-styles.ts`:
```tsx
export const newTemplate: TemplateConfig = {
  id: 'new',
  name: 'New Template',
  description: '...',
  design: { /* ... */ },
  colorUsage: { /* ... */ },
};
```

2. Add to `allTemplates` array

3. Update template preview colors in `TemplateSelector.tsx`

4. Done! Works with all 15 brands automatically

---

## Best Practices

1. **Always use official brand colors** - Never allow custom color selection
2. **Let dealers choose templates** - Not colors, not fonts, just the overall style
3. **Show live previews** - Let dealers see what each template looks like with their brand
4. **Recommend templates** - Guide dealers to the best template for their brand
5. **Maintain consistency** - All templates should feel professional and polished

---

## Support

For questions or issues with the template system, check:
- Template definitions: [template-styles.ts](./template-styles.ts)
- Brand colors: [automotive-brands.ts](../colors/automotive-brands.ts)
- Usage examples: [examples.tsx](../colors/examples.tsx)
