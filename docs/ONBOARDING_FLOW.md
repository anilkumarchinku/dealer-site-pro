# Dealership Onboarding Flow
## Complete 5-Step Process with Template Selection

---

## 📋 Onboarding Steps Overview

### **Step 1: About You** → `/onboarding/step-1`
**Collect dealership information**

Fields:
- Dealership Name
- Location (City, State)
- Years in Business
- Phone Number
- Email

**Next:** Step 2 (Choose Brands)

---

### **Step 2: Your Brands** → `/onboarding/step-2`
**Select what types of cars they sell**

Options:
- ✅ New cars from manufacturers (select brands)
- ✅ Used cars (pre-owned)

If selling new cars:
- Show brand selector (18 brands)
- Allow multi-selection
- Auto-detect dealer type:
  - Single OEM (1 brand)
  - Multi OEM (2+ brands)
  - Used Only
  - Hybrid (New + Used)

**Next:** Step 3 (Your Services)

---

### **Step 3: Your Services** → `/onboarding/step-3`
**Select services offered**

Pre-selected based on dealer type:
- New Car Sales
- Used Car Sales
- Financing & Leasing
- Service & Maintenance
- Parts & Accessories
- Body Shop
- Fleet Sales
- Trade-In Appraisals
- And more...

**Next:** Step 4 (Pick Your Style) 🎨

---

### **Step 4: Website Style** → `/onboarding/step-4` ⭐
**✨ TEMPLATE SELECTION - THE NEW BEAUTIFUL UI**

This step uses the **TemplateSelector** component that matches your screenshot design!

Features:
- 🌑 Dark glassmorphism background
- 🎨 4 professional template options
- 🎯 Smart recommendations based on selected brands
- ✨ Beautiful gradient color previews
- ✅ Interactive selection with animations

**The 4 Templates:**

1. **✨ Luxury & Premium**
   - Elegant, sophisticated dark design
   - Perfect for: BMW, Mercedes, Audi, Lexus, Porsche
   - Gradient: Gold/Amber tones

2. **👨‍👩‍👧‍👦 Family & Friendly** (⭐ Recommended)
   - Warm, welcoming design
   - Perfect for: Toyota, Honda, Subaru, Hyundai, Kia
   - Gradient: Blue tones

3. **🏎️ Bold & Sporty**
   - Dynamic, energetic design
   - Perfect for: Sports cars, Performance brands
   - Gradient: Red/Orange tones

4. **💼 Professional & Business**
   - Clean, trustworthy design
   - Perfect for: Trucks, Fleet sales, Commercial dealers
   - Gradient: Gray/Cyan tones

**How It Works:**
1. System shows all 4 templates
2. User clicks on template card to select
3. Selected template is highlighted with blue border
4. Brand colors are automatically applied (not shown to user yet)
5. Click "Next: Review" to proceed

**Important Notes:**
- ❌ Users DON'T choose colors
- ✅ Users ONLY choose template style
- 🎨 Official brand colors are applied automatically
- 💡 Smart recommendation based on selected brands

**Next:** Step 5 (Review)

---

### **Step 5: Review & Launch** → `/onboarding/step-5`
**Review all selections and generate website**

Shows summary of:
- Dealership info
- Selected brands
- Services
- Website style template

Actions:
- Preview website
- Go back to edit
- Launch website

---

## 🎯 How Template + Brand Colors Work

### The Magic Formula:
```
User's Selected Template + Official Brand Colors = Unique Website
```

### Example Combinations:

| Dealer | Brands | Selected Template | Result |
|--------|--------|-------------------|--------|
| ABC Motors | Toyota | Family & Friendly | Warm design + Toyota Red (#EB0A1E) |
| XYZ Auto | BMW | Luxury & Premium | Elegant design + BMW Blue (#1C69D4) |
| Sports Cars Inc | Mazda | Bold & Sporty | Dynamic design + Mazda Red (#D80027) |
| Fleet Sales Co | Ford | Professional | Clean design + Ford Blue (#003478) |

**4 Templates × 15 Brands = 60 unique website combinations!**

---

## 🎨 Brand Color System Integration

### Where Brand Colors Come From:
**File:** `lib/colors/automotive-brands.ts`

Contains official colors for 15 brands:
- Toyota, Honda, Ford, Chevrolet, BMW
- Mercedes-Benz, Nissan, Hyundai, Volkswagen
- Mazda, Subaru, Kia, Lexus, Acura, Audi

Each brand has:
- Primary color
- Secondary color
- Background color
- Accent color
- Hover state
- Gradient definition

### How Colors Are Applied:
1. User selects brands in Step 2
2. User selects template in Step 4
3. System combines:
   - Template design (layout, typography, spacing)
   - Brand colors (primary, secondary, accent)
4. Result: Unique, professional website

---

## 📁 File Structure

### Onboarding Flow:
```
app/onboarding/
├── layout.tsx                 # Onboarding layout with progress bar
├── step-1/page.tsx           # About You
├── step-2/page.tsx           # Your Brands
├── step-3/page.tsx           # Your Services
├── step-4/page.tsx           # Website Style ⭐ NEW
└── step-5/page.tsx           # Review & Launch
```

### Template System:
```
lib/templates/
├── template-styles.ts         # 4 template definitions
├── template-utils.ts          # Utility functions
├── index.ts                   # Clean exports
└── README.md                  # Documentation

components/onboarding/
└── TemplateSelector.tsx       # Beautiful UI component ⭐
```

### Brand Colors:
```
lib/colors/
├── automotive-brands.ts       # 15 brand colors (official)
├── types.ts                   # Color types
├── utils.ts                   # Color utilities
├── index.ts                   # Exports
├── examples.tsx               # Usage examples
└── README.md                  # Documentation
```

### Admin Demo:
```
app/demo/
└── templates/page.tsx         # Demo page for admins to test
```

---

## 🚀 URLs

### Production Onboarding Flow:
1. `/onboarding/step-1` - Dealership Info
2. `/onboarding/step-2` - Brands Selection
3. `/onboarding/step-3` - Services Selection
4. `/onboarding/step-4` - **Template Selection** ⭐
5. `/onboarding/step-5` - Review & Launch

### Admin Demo (For Reference):
- `/demo/templates` - Live template + brand color preview
  - Test all 4 templates
  - Test all 15 brands
  - See 60 combinations
  - View template specs

---

## ✨ What Makes This Special

### Beautiful UI:
- ✅ Dark glassmorphism design (matches screenshot)
- ✅ Smooth animations and transitions
- ✅ Gradient color previews for each template
- ✅ Clear visual feedback on selection
- ✅ Recommended badge for best match
- ✅ Back/Next navigation built-in

### Smart Features:
- ✅ Auto-recommends template based on brands
- ✅ Official brand colors (not custom)
- ✅ 4 professional templates for all use cases
- ✅ Type-safe with TypeScript
- ✅ Production-ready code

### Developer Experience:
- ✅ Clean component architecture
- ✅ Reusable TemplateSelector component
- ✅ Comprehensive documentation
- ✅ Demo page for testing
- ✅ Easy to extend with new templates

---

## 📝 State Management

### Onboarding Store:
**File:** `lib/store/onboarding-store.ts`

Stores:
- All user selections
- Current step
- Dealer type (auto-detected)

Data structure:
```typescript
{
  dealershipName: string;
  location: string;
  brands: Brand[];
  services: Service[];
  styleTemplate: 'luxury' | 'family' | 'sporty' | 'professional';
  // ...
}
```

---

## 🎨 Color Usage Philosophy

### Client Perspective:
"Just pick a template style - we'll handle the colors automatically using your brand's official colors."

### Why This Works:
1. **Brand Consistency** - Official manufacturer colors only
2. **Simple Decision** - Style, not colors
3. **Professional Results** - Every combination looks great
4. **Faster Onboarding** - One choice instead of dozens

### What Dealers See:
- Step 2: "What brands do you sell?" → Select brands
- Step 4: "What style do you want?" → Select template
- System: Automatically applies brand colors ✨

### What They DON'T See:
- Color pickers
- RGB values
- Hex codes
- Confusing color choices

**Result:** Professional website in 5 minutes! 🚀

---

## 🧪 Testing the Flow

### Local Development:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/onboarding/step-1`
3. Go through all 5 steps
4. At Step 4, see the beautiful template selector!

### Demo Page (Admin):
1. Visit: `http://localhost:3000/demo/templates`
2. Select any brand
3. Select any template
4. See live preview
5. Test all 60 combinations!

---

## 🎉 Summary

You now have a **complete, production-ready onboarding flow** with:

✅ Beautiful template selection UI (matches screenshot)
✅ 4 professional templates
✅ 15 automotive brand colors
✅ 60 unique combinations
✅ Smart recommendations
✅ Official brand colors only
✅ Type-safe TypeScript
✅ Clean architecture
✅ Admin demo page
✅ Comprehensive documentation

**The system is ready to use!** 🚀
