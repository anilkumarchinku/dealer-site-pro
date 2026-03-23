/**
 * lib/data/car-colors.ts
 *
 * Official color data for major 4-wheeler (car) brands sold in India.
 * Color names sourced from manufacturer marketing materials (2023–2025).
 * Hex codes are accurate visual approximations of each paint shade.
 *
 * extraCost is the additional charge in INR on top of the base variant price:
 *   0       = standard / no extra cost
 *   5000    = light premium (metallic / pearl on budget models)
 *   10000   = standard premium metallic/pearl
 *   15000   = dual-tone or exclusive metallic
 *   20000+  = premium pearl / specialty shades on higher segments
 */

export interface CarColor {
  name: string;
  type: "Solid" | "Metallic" | "Pearl" | "Dual Tone";
  hex: string;
  extraCost: number;
}

export const CAR_MODEL_COLORS: Record<string, CarColor[]> = {
  // ─────────────────────────────────────────────────────────────
  // MARUTI SUZUKI — Arena
  // ─────────────────────────────────────────────────────────────
  "Maruti Suzuki Swift": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Sizzling Red", type: "Solid", hex: "#C0272D", extraCost: 0 },
    { name: "Magma Grey", type: "Metallic", hex: "#636363", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Luster Blue", type: "Metallic", hex: "#2A4D8F", extraCost: 10000 },
    { name: "Novel Orange", type: "Metallic", hex: "#D4621A", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Sizzling Red with Bluish Black Roof", type: "Dual Tone", hex: "#C0272D", extraCost: 15000 },
    { name: "Luster Blue with Bluish Black Roof", type: "Dual Tone", hex: "#2A4D8F", extraCost: 15000 },
    { name: "Pearl Arctic White with Bluish Black Roof", type: "Dual Tone", hex: "#F2F2F0", extraCost: 15000 },
  ],

  "Maruti Suzuki Dzire": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Magma Grey", type: "Metallic", hex: "#636363", extraCost: 10000 },
    { name: "Gallant Red", type: "Metallic", hex: "#B52230", extraCost: 10000 },
    { name: "Alluring Blue", type: "Metallic", hex: "#1E3F7A", extraCost: 10000 },
    { name: "Nutmeg Brown", type: "Metallic", hex: "#7A4F38", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
  ],

  "Maruti Suzuki Baleno": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Grandeur Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Opulent Red", type: "Metallic", hex: "#B52030", extraCost: 10000 },
    { name: "Luxe Beige", type: "Metallic", hex: "#C8B89A", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
  ],

  "Maruti Suzuki Brezza": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Magma Grey", type: "Metallic", hex: "#636363", extraCost: 10000 },
    { name: "Sizzling Red", type: "Solid", hex: "#C0272D", extraCost: 0 },
    { name: "Brave Khaki", type: "Metallic", hex: "#8C7B5A", extraCost: 10000 },
    { name: "Exuberant Blue", type: "Metallic", hex: "#1A3B72", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Sizzling Red with Bluish Black Roof", type: "Dual Tone", hex: "#C0272D", extraCost: 15000 },
    { name: "Pearl Arctic White with Bluish Black Roof", type: "Dual Tone", hex: "#F2F2F0", extraCost: 15000 },
    { name: "Exuberant Blue with Bluish Black Roof", type: "Dual Tone", hex: "#1A3B72", extraCost: 15000 },
  ],

  "Maruti Suzuki Ertiga": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Magma Grey", type: "Metallic", hex: "#636363", extraCost: 10000 },
    { name: "Auburn Red", type: "Metallic", hex: "#A0271E", extraCost: 10000 },
    { name: "Prime Oxford Blue", type: "Metallic", hex: "#1C3468", extraCost: 10000 },
    { name: "Pearl Metallic Dignity Brown", type: "Pearl", hex: "#7B5B40", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
  ],

  "Maruti Suzuki XL6": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Premium Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Magma Grey", type: "Metallic", hex: "#636363", extraCost: 10000 },
    { name: "Auburn Red", type: "Metallic", hex: "#A0271E", extraCost: 10000 },
    { name: "Brave Khaki", type: "Metallic", hex: "#8C7B5A", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
  ],

  "Maruti Suzuki Grand Vitara": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Grandeur Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Opulent Red", type: "Metallic", hex: "#B52030", extraCost: 10000 },
    { name: "Chestnut Brown", type: "Metallic", hex: "#7A4A30", extraCost: 10000 },
    { name: "Opulent Red with Black Roof", type: "Dual Tone", hex: "#B52030", extraCost: 15000 },
    { name: "Splendid Silver with Black Roof", type: "Dual Tone", hex: "#B0B0B0", extraCost: 15000 },
    { name: "Pearl Arctic White with Black Roof", type: "Dual Tone", hex: "#F2F2F0", extraCost: 15000 },
  ],

  "Maruti Suzuki Fronx": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Grandeur Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Opulent Red", type: "Metallic", hex: "#B52030", extraCost: 10000 },
    { name: "Earthen Brown", type: "Metallic", hex: "#7A5238", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Opulent Red with Black Roof", type: "Dual Tone", hex: "#B52030", extraCost: 15000 },
    { name: "Earthen Brown with Bluish Black Roof", type: "Dual Tone", hex: "#7A5238", extraCost: 15000 },
    { name: "Splendid Silver with Black Roof", type: "Dual Tone", hex: "#B0B0B0", extraCost: 15000 },
  ],

  "Maruti Suzuki Jimny": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Sizzling Red", type: "Solid", hex: "#C0272D", extraCost: 0 },
    { name: "Granite Gray", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Kinetic Yellow with Bluish Black Roof", type: "Dual Tone", hex: "#D4A800", extraCost: 15000 },
    { name: "Sizzling Red with Bluish Black Roof", type: "Dual Tone", hex: "#C0272D", extraCost: 15000 },
  ],

  "Maruti Suzuki Ciaz": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Prime Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Prime Grandeur Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Prime Celestial Blue", type: "Metallic", hex: "#1A3A70", extraCost: 10000 },
    { name: "Prime Opulent Red", type: "Metallic", hex: "#B52030", extraCost: 10000 },
    { name: "Prime Dignity Brown", type: "Metallic", hex: "#7A5040", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Prime Opulent Red with Bluish Black Roof", type: "Dual Tone", hex: "#B52030", extraCost: 15000 },
    { name: "Prime Grandeur Grey with Bluish Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Prime Dignity Brown with Bluish Black Roof", type: "Dual Tone", hex: "#7A5040", extraCost: 15000 },
  ],

  "Maruti Suzuki Ignis": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Silky Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Glistening Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Lucent Orange", type: "Metallic", hex: "#E06020", extraCost: 10000 },
    { name: "Turquoise Blue", type: "Metallic", hex: "#1A7EA0", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Nexa Blue with Silver Roof", type: "Dual Tone", hex: "#1E3E7B", extraCost: 15000 },
    { name: "Nexa Blue with Black Roof", type: "Dual Tone", hex: "#1E3E7B", extraCost: 15000 },
    { name: "Lucent Orange with Black Roof", type: "Dual Tone", hex: "#E06020", extraCost: 15000 },
  ],

  "Maruti Suzuki S-Presso": [
    { name: "Solid White", type: "Solid", hex: "#EFEFEF", extraCost: 0 },
    { name: "Solid Fire Red", type: "Solid", hex: "#C0272D", extraCost: 0 },
    { name: "Solid Sizzle Orange", type: "Solid", hex: "#E86510", extraCost: 0 },
    { name: "Metallic Silky Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Metallic Granite Grey", type: "Metallic", hex: "#666666", extraCost: 5000 },
    { name: "Pearl Starry Blue", type: "Pearl", hex: "#1E3870", extraCost: 5000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 5000 },
  ],

  "Maruti Suzuki Celerio": [
    { name: "Pearl Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 5000 },
    { name: "Metallic Silky Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Metallic Glistening Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Metallic Speedy Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 5000 },
    { name: "Solid Fire Red", type: "Solid", hex: "#C0272D", extraCost: 0 },
    { name: "Pearl Caffeine Brown", type: "Pearl", hex: "#7A5038", extraCost: 5000 },
    { name: "Pearl Bluish Black", type: "Pearl", hex: "#1C1F2B", extraCost: 5000 },
  ],

  "Maruti Suzuki WagonR": [
    { name: "Solid White", type: "Solid", hex: "#EFEFEF", extraCost: 0 },
    { name: "Metallic Silky Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Metallic Magma Grey", type: "Metallic", hex: "#636363", extraCost: 5000 },
    { name: "Poolside Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 5000 },
    { name: "Autumn Orange", type: "Metallic", hex: "#D4681A", extraCost: 5000 },
    { name: "Nutmeg Brown", type: "Metallic", hex: "#7A5038", extraCost: 5000 },
  ],

  "Maruti Suzuki Alto K10": [
    { name: "Solid White", type: "Solid", hex: "#EFEFEF", extraCost: 0 },
    { name: "Metallic Silky Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Metallic Granite Grey", type: "Metallic", hex: "#666666", extraCost: 5000 },
    { name: "Metallic Speedy Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 5000 },
    { name: "Metallic Sizzling Red", type: "Metallic", hex: "#C0272D", extraCost: 5000 },
    { name: "Premium Earth Gold", type: "Metallic", hex: "#B8960C", extraCost: 5000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 5000 },
  ],

  "Maruti Suzuki Invicto": [
    { name: "Mystic White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Majestic Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Stellar Bronze", type: "Metallic", hex: "#8C6840", extraCost: 10000 },
    { name: "Nexa Blue (Celestial)", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // HYUNDAI
  // ─────────────────────────────────────────────────────────────
  "Hyundai Creta": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Robust Emerald Pearl", type: "Pearl", hex: "#2A5C3A", extraCost: 15000 },
    { name: "Ranger Khaki", type: "Metallic", hex: "#7A6E4A", extraCost: 10000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Titan Grey Matte", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Black Matte", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  "Hyundai i20": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Typhoon Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Amazon Grey", type: "Metallic", hex: "#545454", extraCost: 10000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  "Hyundai Venue": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Dragon Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Hazel Blue", type: "Metallic", hex: "#2A4A7A", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Mystic Sapphire", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Hazel Blue with Abyss Black Roof", type: "Dual Tone", hex: "#2A4A7A", extraCost: 15000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  "Hyundai Verna": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Titanium Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Classy Blue", type: "Metallic", hex: "#1A3878", extraCost: 10000 },
    { name: "Titan Grey Matte", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Atlas White with Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  "Hyundai Alcazar": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Ranger Khaki", type: "Metallic", hex: "#7A6E4A", extraCost: 10000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Galaxy Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Amazon Grey", type: "Metallic", hex: "#545454", extraCost: 10000 },
    { name: "Matte Dark Green", type: "Metallic", hex: "#2A3E2A", extraCost: 20000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  "Hyundai Tucson": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Amazon Grey", type: "Metallic", hex: "#545454", extraCost: 10000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
    { name: "Fiery Red with Abyss Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
  ],

  "Hyundai Exter": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Titan Grey Matte", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Shadow Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Cosmic Blue", type: "Metallic", hex: "#1A3870", extraCost: 10000 },
    { name: "Ranger Khaki", type: "Metallic", hex: "#7A6E4A", extraCost: 10000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
    { name: "Cosmic Blue with Abyss Black Roof", type: "Dual Tone", hex: "#1A3870", extraCost: 15000 },
    { name: "Ranger Khaki with Abyss Black Roof", type: "Dual Tone", hex: "#7A6E4A", extraCost: 15000 },
    { name: "Shadow Grey with Abyss Black Roof", type: "Dual Tone", hex: "#5A5A5A", extraCost: 15000 },
  ],

  "Hyundai Grand i10 Nios": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Typhoon Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 5000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 5000 },
    { name: "Amazon Grey", type: "Metallic", hex: "#545454", extraCost: 5000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 5000 },
    { name: "Teal Blue", type: "Metallic", hex: "#1A6070", extraCost: 5000 },
    { name: "Aqua Teal", type: "Metallic", hex: "#1A7A8A", extraCost: 5000 },
    { name: "Spark Green", type: "Metallic", hex: "#2A8A40", extraCost: 5000 },
    { name: "Atlas White Dual Tone", type: "Dual Tone", hex: "#F0EFE8", extraCost: 10000 },
    { name: "Spark Green Dual Tone", type: "Dual Tone", hex: "#2A8A40", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // TATA MOTORS
  // ─────────────────────────────────────────────────────────────
  "Tata Nexon": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Calgary White", type: "Pearl", hex: "#EEF0EE", extraCost: 10000 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Ocean Blue", type: "Metallic", hex: "#1A3878", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Seaweed Green", type: "Metallic", hex: "#2A5038", extraCost: 10000 },
    { name: "Fearless Purple", type: "Metallic", hex: "#4A2A6A", extraCost: 10000 },
    { name: "Fearless Purple with Black Roof", type: "Dual Tone", hex: "#4A2A6A", extraCost: 15000 },
    { name: "Calgary White with Black Roof", type: "Dual Tone", hex: "#EEF0EE", extraCost: 15000 },
  ],

  "Tata Punch": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Coorg Clouds", type: "Pearl", hex: "#EAEAE8", extraCost: 10000 },
    { name: "Bengal Rouge", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Cyantafic", type: "Metallic", hex: "#1A7080", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Caramel", type: "Metallic", hex: "#C08840", extraCost: 10000 },
    { name: "Pristine White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Bengal Rouge with White Roof", type: "Dual Tone", hex: "#C42020", extraCost: 15000 },
    { name: "Cyantafic with White Roof", type: "Dual Tone", hex: "#1A7080", extraCost: 15000 },
    { name: "Daytona Grey with Black Roof", type: "Dual Tone", hex: "#646464", extraCost: 15000 },
    { name: "Coorg Clouds with Black Roof", type: "Dual Tone", hex: "#EAEAE8", extraCost: 15000 },
    { name: "Caramel with Black Roof", type: "Dual Tone", hex: "#C08840", extraCost: 15000 },
  ],

  "Tata Tiago": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Avenue White", type: "Pearl", hex: "#E8EAE8", extraCost: 5000 },
    { name: "Tornado Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 5000 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 5000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
    { name: "Tornado Blue Dual Tone", type: "Dual Tone", hex: "#1A3A7A", extraCost: 10000 },
  ],

  "Tata Tigor": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 5000 },
    { name: "Avenue White", type: "Pearl", hex: "#E8EAE8", extraCost: 5000 },
    { name: "Magnetic Red", type: "Metallic", hex: "#A82020", extraCost: 5000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
  ],

  "Tata Altroz": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Avenue White", type: "Pearl", hex: "#E8EAE8", extraCost: 5000 },
    { name: "Royal Blue", type: "Metallic", hex: "#1A3070", extraCost: 5000 },
    { name: "Ember Glow", type: "Metallic", hex: "#C84018", extraCost: 5000 },
    { name: "Dune Glow", type: "Metallic", hex: "#C0901C", extraCost: 5000 },
    { name: "Pure Grey with Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Avenue White with Black Roof", type: "Dual Tone", hex: "#E8EAE8", extraCost: 10000 },
  ],

  "Tata Harrier": [
    { name: "Pristine White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Fearless Red", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Sunlit Yellow", type: "Metallic", hex: "#D4A400", extraCost: 10000 },
    { name: "Seaweed Green", type: "Metallic", hex: "#2A5038", extraCost: 10000 },
  ],

  "Tata Safari": [
    { name: "Frost White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Royal Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Supernova Copper", type: "Metallic", hex: "#B87840", extraCost: 10000 },
    { name: "Cosmic Gold", type: "Metallic", hex: "#C0A030", extraCost: 10000 },
  ],

  "Tata Nexon EV": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Intensi-Teal", type: "Metallic", hex: "#1A6878", extraCost: 10000 },
    { name: "Fearless Purple", type: "Metallic", hex: "#4A2A6A", extraCost: 10000 },
  ],

  "Tata Punch EV": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Empowered Oxide", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Seaweed Green", type: "Metallic", hex: "#2A5038", extraCost: 10000 },
    { name: "Cosmic Copper", type: "Metallic", hex: "#B87840", extraCost: 10000 },
    { name: "Pristine White with Midnight Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
  ],

  "Tata Tiago EV": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 5000 },
    { name: "Tropical Mist", type: "Metallic", hex: "#1A8888", extraCost: 5000 },
    { name: "Tetanol Teal", type: "Metallic", hex: "#1A6878", extraCost: 5000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // HONDA
  // ─────────────────────────────────────────────────────────────
  "Honda City": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Meteoroid Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Lunar Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Radiant Red Metallic", type: "Metallic", hex: "#B82020", extraCost: 10000 },
    { name: "Obsidian Blue Pearl", type: "Pearl", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Golden Brown Metallic", type: "Metallic", hex: "#8C6840", extraCost: 10000 },
  ],

  "Honda Amaze": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Meteoroid Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Lunar Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Radiant Red Metallic", type: "Metallic", hex: "#B82020", extraCost: 10000 },
    { name: "Obsidian Blue Pearl", type: "Pearl", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Golden Brown Metallic", type: "Metallic", hex: "#8C6840", extraCost: 10000 },
  ],

  "Honda Elevate": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Meteoroid Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Lunar Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Radiant Red Metallic", type: "Metallic", hex: "#B82020", extraCost: 10000 },
    { name: "Obsidian Blue Pearl", type: "Pearl", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Golden Brown Metallic", type: "Metallic", hex: "#8C6840", extraCost: 10000 },
    { name: "Crystal Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Phoenix Orange Pearl", type: "Pearl", hex: "#D06010", extraCost: 15000 },
    { name: "Platinum White Pearl with Crystal Black Pearl Roof", type: "Dual Tone", hex: "#EFEFED", extraCost: 15000 },
    { name: "Radiant Red Metallic with Crystal Black Pearl Roof", type: "Dual Tone", hex: "#B82020", extraCost: 15000 },
    { name: "Lunar Silver Metallic with Crystal Black Pearl Roof", type: "Dual Tone", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Phoenix Orange Pearl with Crystal Black Pearl Roof", type: "Dual Tone", hex: "#D06010", extraCost: 20000 },
    { name: "Meteoroid Grey Metallic with Crystal Black Pearl Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
  ],

  "Honda WR-V": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Meteoroid Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Lunar Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Radiant Red Metallic", type: "Metallic", hex: "#B82020", extraCost: 10000 },
    { name: "Obsidian Blue Pearl", type: "Pearl", hex: "#1A2A5A", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // TOYOTA
  // ─────────────────────────────────────────────────────────────
  "Toyota Fortuner": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Super White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Sparkling Black Crystal Shine", type: "Pearl", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Attitude Black Mica", type: "Metallic", hex: "#2A2A2A", extraCost: 15000 },
    { name: "Avant-Garde Bronze Metallic", type: "Metallic", hex: "#8C6840", extraCost: 15000 },
    { name: "Phantom Brown", type: "Metallic", hex: "#5A3A20", extraCost: 15000 },
  ],

  "Toyota Innova Crysta": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Super White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Attitude Black Mica", type: "Metallic", hex: "#2A2A2A", extraCost: 15000 },
    { name: "Avant-Garde Bronze Metallic", type: "Metallic", hex: "#8C6840", extraCost: 15000 },
  ],

  "Toyota Innova HyCross": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Super White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Silver Metallic", type: "Metallic", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Sparkling Black Pearl Crystal Shine", type: "Pearl", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Attitude Black Mica", type: "Metallic", hex: "#2A2A2A", extraCost: 15000 },
    { name: "Avant-Garde Bronze Metallic", type: "Metallic", hex: "#8C6840", extraCost: 15000 },
    { name: "Blackish Ageha Glass Flake", type: "Pearl", hex: "#222222", extraCost: 20000 },
  ],

  "Toyota Urban Cruiser Hyryder": [
    { name: "Cafe White", type: "Solid", hex: "#F0EEE8", extraCost: 0 },
    { name: "Enticing Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Gaming Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Sportin Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Cave Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Speedy Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 10000 },
    { name: "Cafe White with Midnight Black Roof", type: "Dual Tone", hex: "#F0EEE8", extraCost: 15000 },
    { name: "Speedy Blue with Midnight Black Roof", type: "Dual Tone", hex: "#1A4A8C", extraCost: 15000 },
    { name: "Enticing Silver with Midnight Black Roof", type: "Dual Tone", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Sportin Red with Midnight Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
  ],

  "Toyota Glanza": [
    { name: "Cafe White", type: "Solid", hex: "#F0EEE8", extraCost: 0 },
    { name: "Enticing Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Gaming Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Sportin Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Insta Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 10000 },
  ],

  "Toyota Camry": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 20000 },
    { name: "Attitude Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Dark Blue", type: "Metallic", hex: "#1A2A4A", extraCost: 20000 },
    { name: "Emotional Red", type: "Metallic", hex: "#C02020", extraCost: 20000 },
    { name: "Cement Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Precious Metal", type: "Metallic", hex: "#8C8470", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // KIA
  // ─────────────────────────────────────────────────────────────
  "Kia Seltos": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Ivory Silver Gloss", type: "Metallic", hex: "#CCCCCC", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Magma Red", type: "Metallic", hex: "#B82020", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Frost Blue", type: "Metallic", hex: "#4A7A9A", extraCost: 10000 },
    { name: "Morning Haze", type: "Metallic", hex: "#B0A880", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Matte Graphite", type: "Metallic", hex: "#3A3A3A", extraCost: 20000 },
    { name: "Glacier White Pearl with Aurora Black Roof", type: "Dual Tone", hex: "#EFEFED", extraCost: 15000 },
    { name: "Magma Red with Aurora Black Roof", type: "Dual Tone", hex: "#B82020", extraCost: 15000 },
  ],

  "Kia Sonet": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Sparkling Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Intense Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Glacier White Pearl with Aurora Black Roof", type: "Dual Tone", hex: "#EFEFED", extraCost: 15000 },
    { name: "Intense Red with Aurora Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
  ],

  "Kia Carens": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Clear White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Sparkling Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Intense Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Matte Graphite", type: "Metallic", hex: "#3A3A3A", extraCost: 20000 },
  ],

  "Kia EV6": [
    { name: "Snow White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Moonscape", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Yacht Blue", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
    { name: "Runway Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MG MOTOR
  // ─────────────────────────────────────────────────────────────
  "MG Hector": [
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Glaze Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Celadon Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 10000 },
  ],

  "MG Astor": [
    { name: "Candy White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Havana Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Glaze Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Candy White with Starry Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 15000 },
  ],

  "MG ZS EV": [
    { name: "Candy White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Glaze Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Evergreen with Black Roof", type: "Dual Tone", hex: "#2A5038", extraCost: 15000 },
  ],

  "MG Comet EV": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Apple Green with Starry Black Roof", type: "Dual Tone", hex: "#4A8A30", extraCost: 10000 },
    { name: "Candy White with Starry Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 10000 },
  ],

  "MG Gloster": [
    { name: "Warm White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Pearl White", type: "Pearl", hex: "#EEEEED", extraCost: 15000 },
    { name: "Metal Ash", type: "Metallic", hex: "#8A8A8A", extraCost: 15000 },
    { name: "Metal Black", type: "Metallic", hex: "#2A2A2A", extraCost: 15000 },
    { name: "Deep Golden", type: "Metallic", hex: "#C0900A", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MAHINDRA
  // ─────────────────────────────────────────────────────────────
  "Mahindra Thar": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Deep Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Desert Fury", type: "Metallic", hex: "#C8900A", extraCost: 10000 },
  ],

  "Mahindra XUV700": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Dazzling Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Electric Blue", type: "Metallic", hex: "#1A3080", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Burnt Sienna", type: "Metallic", hex: "#8A4020", extraCost: 10000 },
    { name: "Blaze Red", type: "Metallic", hex: "#B01010", extraCost: 10000 },
  ],

  "Mahindra Scorpio-N": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Dazzling Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Burnt Sienna", type: "Metallic", hex: "#8A4020", extraCost: 10000 },
  ],

  "Mahindra Scorpio Classic": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Deep Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Dazzling Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
  ],

  "Mahindra XUV400": [
    { name: "Everest White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Galaxy Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Arctic Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 10000 },
    { name: "Infinity Blue", type: "Metallic", hex: "#1A2A6A", extraCost: 10000 },
    { name: "Everest White Dual Tone", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Galaxy Grey Dual Tone", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Arctic Blue Dual Tone", type: "Dual Tone", hex: "#1A4A7A", extraCost: 15000 },
    { name: "Infinity Blue Dual Tone", type: "Dual Tone", hex: "#1A2A6A", extraCost: 15000 },
    { name: "Napoli Black Dual Tone", type: "Dual Tone", hex: "#2A2A2A", extraCost: 15000 },
  ],

  "Mahindra XUV300": [
    { name: "Pearl White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Everest White", type: "Solid", hex: "#EFEFED", extraCost: 0 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Dark Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Aquamarine", type: "Metallic", hex: "#1A6878", extraCost: 10000 },
    { name: "Blazing Bronze", type: "Metallic", hex: "#8C6030", extraCost: 10000 },
    { name: "Dual Tone White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Dual Tone Bronze with Black Roof", type: "Dual Tone", hex: "#8C6030", extraCost: 15000 },
    { name: "Dual Tone Black with White Roof", type: "Dual Tone", hex: "#2A2A2A", extraCost: 15000 },
  ],

  "Mahindra Bolero": [
    { name: "Diamond White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Mist Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 5000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Rocky Beige", type: "Solid", hex: "#C8B890", extraCost: 0 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
  ],

  // ─────────────────────────────────────────────────────────────
  // RENAULT
  // ─────────────────────────────────────────────────────────────
  "Renault Kwid": [
    { name: "Ice Cool White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Moonlight Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Zanskar Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 5000 },
    { name: "Fiery Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Outback Bronze", type: "Metallic", hex: "#8C6430", extraCost: 5000 },
    { name: "Metal Mustard", type: "Solid", hex: "#C89800", extraCost: 0 },
    { name: "Zanskar Blue with Black Roof", type: "Dual Tone", hex: "#1A4A7A", extraCost: 10000 },
    { name: "Ice Cool White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Moonlight Silver with Black Roof", type: "Dual Tone", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Fiery Red with Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 10000 },
    { name: "Metal Mustard with Black Roof", type: "Dual Tone", hex: "#C89800", extraCost: 10000 },
  ],

  "Renault Triber": [
    { name: "Ice Cool White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Moonlight Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Fiery Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Zanskar Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 5000 },
    { name: "Outback Bronze", type: "Metallic", hex: "#8C6430", extraCost: 5000 },
    { name: "Zanskar Blue with Black Roof", type: "Dual Tone", hex: "#1A4A7A", extraCost: 10000 },
    { name: "Ice Cool White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Fiery Red with Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 10000 },
  ],

  "Renault Kiger": [
    { name: "Ice Cool White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Moonlight Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Shadow Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Caspian Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 5000 },
    { name: "Radiant Red", type: "Metallic", hex: "#C02020", extraCost: 5000 },
    { name: "Oasis Yellow", type: "Metallic", hex: "#D4A400", extraCost: 5000 },
    { name: "Oasis Yellow with Mystery Black Roof", type: "Dual Tone", hex: "#D4A400", extraCost: 10000 },
    { name: "Shadow Grey with Mystery Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Ice Cool White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // VOLKSWAGEN
  // ─────────────────────────────────────────────────────────────
  "Volkswagen Virtus": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Reflex Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Carbon Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Carbon Steel Matte Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Deep Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Wild Cherry Red", type: "Metallic", hex: "#A82020", extraCost: 10000 },
    { name: "Rising Blue Metallic", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
  ],

  "Volkswagen Taigun": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Reflex Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Carbon Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Deep Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Wild Cherry Red", type: "Metallic", hex: "#A82020", extraCost: 10000 },
    { name: "Rising Blue Metallic", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Kurkuma Yellow", type: "Metallic", hex: "#D4A400", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // SKODA
  // ─────────────────────────────────────────────────────────────
  "Skoda Slavia": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Carbon Steel", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Carbon Steel Matte", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Deep Black", type: "Metallic", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Tornado Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Cherry Red", type: "Metallic", hex: "#A82020", extraCost: 10000 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Crystal Blue", type: "Metallic", hex: "#2A5080", extraCost: 10000 },
    { name: "Candy White with Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Cherry Red with Black Roof", type: "Dual Tone", hex: "#A82020", extraCost: 15000 },
    { name: "Deep Black with Black Roof", type: "Dual Tone", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Brilliant Silver with Black Roof", type: "Dual Tone", hex: "#C8C8C8", extraCost: 15000 },
    { name: "Tornado Red with Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
    { name: "Crystal Blue with Carbon Steel Roof", type: "Dual Tone", hex: "#2A5080", extraCost: 15000 },
    { name: "Brilliant Silver with Carbon Steel Roof", type: "Dual Tone", hex: "#C8C8C8", extraCost: 15000 },
    { name: "Carbon Steel with Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Lava Blue with Black Roof", type: "Dual Tone", hex: "#1A2A5A", extraCost: 15000 },
  ],

  "Skoda Kushaq": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Carbon Steel", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Tornado Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Honey Orange", type: "Metallic", hex: "#D07020", extraCost: 10000 },
  ],

  "Skoda Octavia": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 15000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 15000 },
    { name: "Magic Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 15000 },
  ],

  "Skoda Superb": [
    { name: "Magic Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Rosso Brunello", type: "Metallic", hex: "#7A2020", extraCost: 20000 },
    { name: "Water World Green", type: "Metallic", hex: "#2A5038", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // JEEP
  // ─────────────────────────────────────────────────────────────
  "Jeep Compass": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Brilliant Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Exotica Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
    { name: "Galaxy Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 15000 },
    { name: "Grigio Magnesio", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Silvery Moon", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Techno Metallic Green", type: "Metallic", hex: "#2A4A38", extraCost: 15000 },
  ],

  "Jeep Meridian": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Brilliant Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Velvet Red", type: "Metallic", hex: "#A02020", extraCost: 15000 },
    { name: "Galaxy Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 15000 },
    { name: "Magnesio Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Silvery Moon", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Techno Metallic Green", type: "Metallic", hex: "#2A4A38", extraCost: 15000 },
    { name: "Minimal Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 15000 },
  ],

  "Jeep Wrangler": [
    { name: "Bright White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Granite Crystal Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Firecracker Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Sarge Green", type: "Metallic", hex: "#4A5838", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // NISSAN
  // ─────────────────────────────────────────────────────────────
  "Nissan Magnite": [
    { name: "Storm White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pearl White", type: "Pearl", hex: "#EEEEEC", extraCost: 5000 },
    { name: "Blade Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Onyx Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Flare Garnet Red", type: "Metallic", hex: "#A82020", extraCost: 5000 },
    { name: "Vivid Blue", type: "Metallic", hex: "#1A3878", extraCost: 5000 },
    { name: "Sunrise Copper Orange", type: "Metallic", hex: "#C07030", extraCost: 5000 },
    { name: "Pearl White with Onyx Black Roof", type: "Dual Tone", hex: "#EEEEEC", extraCost: 10000 },
    { name: "Blade Silver with Onyx Black Roof", type: "Dual Tone", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Flare Garnet Red with Onyx Black Roof", type: "Dual Tone", hex: "#A82020", extraCost: 10000 },
    { name: "Vivid Blue with Onyx Black Roof", type: "Dual Tone", hex: "#1A3878", extraCost: 10000 },
    { name: "Sunrise Copper Orange with Onyx Black Roof", type: "Dual Tone", hex: "#C07030", extraCost: 10000 },
  ],

  "Nissan X-Trail": [
    { name: "Ivory Pearl", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Brilliant Silver Metallic", type: "Metallic", hex: "#C8C8C8", extraCost: 15000 },
    { name: "Super Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Gun Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Deep Blue Pearl", type: "Pearl", hex: "#1A2A5A", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // BYD
  // ─────────────────────────────────────────────────────────────
  "BYD Atto 3": [
    { name: "Ski White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Harbour Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Surf Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
  ],

  "BYD Seal": [
    { name: "Aurora White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Atlantis Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Arctic Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 15000 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
  ],

  "BYD e6": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
  ],
};
