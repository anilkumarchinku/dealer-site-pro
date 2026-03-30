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

  // ─────────────────────────────────────────────────────────────
  // HYUNDAI — additional models
  // ─────────────────────────────────────────────────────────────
  "Hyundai Aura": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Typhoon Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 5000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 5000 },
    { name: "Fiery Red", type: "Metallic", hex: "#C02020", extraCost: 5000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 5000 },
    { name: "Aqua Teal", type: "Metallic", hex: "#1A7A8A", extraCost: 5000 },
  ],

  "Hyundai Creta EV": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Fiery Red Pearl", type: "Pearl", hex: "#C02020", extraCost: 15000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Ocean Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 10000 },
    { name: "Ocean Blue Matte", type: "Metallic", hex: "#1A4A8C", extraCost: 20000 },
    { name: "Titan Grey Matte", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Robust Emerald Matte", type: "Metallic", hex: "#2A5C3A", extraCost: 20000 },
    { name: "Shadow Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Black Matte", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Atlas White with Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
    { name: "Ocean Blue with Black Roof", type: "Dual Tone", hex: "#1A4A8C", extraCost: 15000 },
  ],

  "Hyundai Creta N Line": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Titan Grey Matte", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Black Matte", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Shadow Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
    { name: "Thunder Blue with Abyss Black Roof", type: "Dual Tone", hex: "#1A3878", extraCost: 15000 },
  ],

  "Hyundai Ioniq 5": [
    { name: "Optic White", type: "Pearl", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Midnight Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 20000 },
    { name: "Gravity Gold Matte", type: "Metallic", hex: "#B8A060", extraCost: 20000 },
  ],

  "Hyundai Prime HB": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Typhoon Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 5000 },
    { name: "Abyss Black", type: "Pearl", hex: "#1A1A1A", extraCost: 5000 },
  ],

  "Hyundai Prime SD": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Typhoon Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 5000 },
    { name: "Abyss Black", type: "Pearl", hex: "#1A1A1A", extraCost: 5000 },
  ],

  "Hyundai Venue N Line": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Hazel Blue", type: "Metallic", hex: "#2A4A7A", extraCost: 10000 },
    { name: "Dragon Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
    { name: "Hazel Blue with Abyss Black Roof", type: "Dual Tone", hex: "#2A4A7A", extraCost: 15000 },
    { name: "Dragon Red with Abyss Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
  ],

  "Hyundai i20 N Line": [
    { name: "Atlas White", type: "Solid", hex: "#F0EFE8", extraCost: 0 },
    { name: "Abyss Black", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Thunder Blue", type: "Metallic", hex: "#1A3878", extraCost: 10000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6E6E6E", extraCost: 10000 },
    { name: "Starry Night", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Thunder Blue with Abyss Black Roof", type: "Dual Tone", hex: "#1A3878", extraCost: 15000 },
    { name: "Atlas White with Abyss Black Roof", type: "Dual Tone", hex: "#F0EFE8", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MARUTI SUZUKI — additional models
  // ─────────────────────────────────────────────────────────────
  "Maruti Suzuki e Vitara": [
    { name: "Arctic White", type: "Pearl", hex: "#F2F2F0", extraCost: 10000 },
    { name: "Splendid Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 10000 },
    { name: "Grandeur Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nexa Blue", type: "Metallic", hex: "#1E3E7B", extraCost: 10000 },
    { name: "Opulent Red", type: "Metallic", hex: "#B52030", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Arctic White with Bluish Black Roof", type: "Dual Tone", hex: "#F2F2F0", extraCost: 15000 },
    { name: "Splendid Silver with Bluish Black Roof", type: "Dual Tone", hex: "#B0B0B0", extraCost: 15000 },
    { name: "Opulent Red with Bluish Black Roof", type: "Dual Tone", hex: "#B52030", extraCost: 15000 },
    { name: "Land Breeze Green with Bluish Black Roof", type: "Dual Tone", hex: "#4A6E3A", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // TATA MOTORS — additional models
  // ─────────────────────────────────────────────────────────────
  "Tata Curvv": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 10000 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Opera Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Gold Essence", type: "Metallic", hex: "#C0A030", extraCost: 10000 },
    { name: "Glossy Carbon Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Pristine White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Opera Blue with Black Roof", type: "Dual Tone", hex: "#1A3070", extraCost: 15000 },
    { name: "Flame Red with Black Roof", type: "Dual Tone", hex: "#C42020", extraCost: 15000 },
    { name: "Gold Essence with Black Roof", type: "Dual Tone", hex: "#C0A030", extraCost: 15000 },
    { name: "Pure Grey with Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Daytona Grey with Black Roof", type: "Dual Tone", hex: "#646464", extraCost: 15000 },
  ],

  "Tata Curvv EV": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Flame Red", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Empowered Oxide", type: "Metallic", hex: "#C84028", extraCost: 10000 },
    { name: "Virtual Sunrise", type: "Metallic", hex: "#D4A860", extraCost: 10000 },
    { name: "Carbon Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Flame Red with Black Roof", type: "Dual Tone", hex: "#C42020", extraCost: 15000 },
    { name: "Pristine White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Pure Grey with Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Empowered Oxide with Black Roof", type: "Dual Tone", hex: "#C84028", extraCost: 15000 },
    { name: "Virtual Sunrise with Black Roof", type: "Dual Tone", hex: "#D4A860", extraCost: 15000 },
  ],

  "Tata Harrier EV": [
    { name: "Pristine White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Empowered Oxide", type: "Metallic", hex: "#C84028", extraCost: 10000 },
    { name: "Nainital Nocturne", type: "Metallic", hex: "#1A2A4A", extraCost: 10000 },
    { name: "Matte Stealth Black", type: "Metallic", hex: "#1E1E1E", extraCost: 20000 },
  ],

  "Tata Sierra": [
    { name: "Pristine White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pure Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Coorg Clouds", type: "Pearl", hex: "#EAEAE8", extraCost: 10000 },
    { name: "Bengal Rouge", type: "Metallic", hex: "#C42020", extraCost: 10000 },
    { name: "Munnar Mist", type: "Metallic", hex: "#2A5038", extraCost: 10000 },
    { name: "Andaman Adventure", type: "Metallic", hex: "#D4A400", extraCost: 10000 },
  ],

  "Tata Tiago NRG": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
    { name: "Grassland Beige", type: "Metallic", hex: "#C8B890", extraCost: 5000 },
    { name: "Supernova Copper", type: "Metallic", hex: "#B87840", extraCost: 5000 },
  ],

  "Tata Tigor EV": [
    { name: "Signature Teal Blue", type: "Metallic", hex: "#1A6878", extraCost: 5000 },
    { name: "Magnetic Red", type: "Metallic", hex: "#A82020", extraCost: 5000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
    { name: "Signature Teal Blue Dual Tone", type: "Dual Tone", hex: "#1A6878", extraCost: 10000 },
    { name: "Daytona Grey Dual Tone", type: "Dual Tone", hex: "#646464", extraCost: 10000 },
  ],

  "Tata Xpres": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
  ],

  "Tata Xpres-T EV": [
    { name: "Pearlescent White", type: "Pearl", hex: "#EEEEED", extraCost: 5000 },
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Signature Teal Blue", type: "Metallic", hex: "#1A6878", extraCost: 5000 },
    { name: "Daytona Grey", type: "Metallic", hex: "#646464", extraCost: 5000 },
    { name: "Magnetic Red", type: "Metallic", hex: "#A82020", extraCost: 5000 },
  ],

  "Tata Yodha Pickup": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MAHINDRA — additional models
  // ─────────────────────────────────────────────────────────────
  "Mahindra BE 6": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Tango Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Desert Myst", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Firestorm Orange", type: "Metallic", hex: "#D06020", extraCost: 10000 },
    { name: "Desert Myst Satin", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
    { name: "Everest White Satin", type: "Pearl", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Satin Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
  ],

  "Mahindra Bolero Camper": [
    { name: "Brown", type: "Solid", hex: "#7A5238", extraCost: 0 },
  ],

  "Mahindra Bolero Neo": [
    { name: "Diamond White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Pearl White", type: "Pearl", hex: "#EEEEED", extraCost: 5000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Rocky Beige", type: "Solid", hex: "#C8B890", extraCost: 0 },
    { name: "Jeans Blue", type: "Metallic", hex: "#2A4A7A", extraCost: 5000 },
    { name: "Concrete Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 5000 },
    { name: "Pearl White with Black Roof", type: "Dual Tone", hex: "#EEEEED", extraCost: 10000 },
    { name: "Jeans Blue with Black Roof", type: "Dual Tone", hex: "#2A4A7A", extraCost: 10000 },
    { name: "Concrete Grey with Black Roof", type: "Dual Tone", hex: "#8A8A8A", extraCost: 10000 },
  ],

  "Mahindra Bolero Neo Plus": [
    { name: "Diamond White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Majestic Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 5000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
  ],

  "Mahindra Bolero Pik-Up": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
  ],

  "Mahindra Marazzo": [
    { name: "Iceberg White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Shimmering Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Aqua Marine", type: "Metallic", hex: "#1A6878", extraCost: 5000 },
    { name: "Oceanic Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
  ],

  "Mahindra Scorpio N": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Dazzling Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Red Rage", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
  ],

  "Mahindra Thar Roxx": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Tango Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Battleship Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Burnt Sienna", type: "Metallic", hex: "#8A4020", extraCost: 10000 },
    { name: "Citrine Yellow", type: "Metallic", hex: "#D4A400", extraCost: 10000 },
  ],

  "Mahindra XEV 9e": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Tango Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Desert Myst", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Ruby Velvet", type: "Metallic", hex: "#7A2030", extraCost: 10000 },
    { name: "Satin White", type: "Pearl", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Satin Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
  ],

  "Mahindra XEV 9S": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Ruby Velvet", type: "Metallic", hex: "#7A2030", extraCost: 10000 },
    { name: "Desert Myst", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
  ],

  "Mahindra XUV 3XO": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Tango Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Galaxy Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
    { name: "Citrine Yellow", type: "Metallic", hex: "#D4A400", extraCost: 10000 },
    { name: "Dune Beige", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
    { name: "Tango Red with Stealth Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
    { name: "Galaxy Grey with Stealth Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Everest White with Stealth Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Citrine Yellow with Stealth Black Roof", type: "Dual Tone", hex: "#D4A400", extraCost: 15000 },
    { name: "Dune Beige with Stealth Black Roof", type: "Dual Tone", hex: "#C8B890", extraCost: 15000 },
    { name: "Nebula Blue with Galvano Grey Roof", type: "Dual Tone", hex: "#1A3070", extraCost: 15000 },
    { name: "Deep Forest with Galvano Grey Roof", type: "Dual Tone", hex: "#2A4030", extraCost: 15000 },
    { name: "Stealth Black with Galvano Grey Roof", type: "Dual Tone", hex: "#2A2A2A", extraCost: 15000 },
  ],

  "Mahindra XUV 3XO EV": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Tango Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Galaxy Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Deep Forest", type: "Metallic", hex: "#2A4030", extraCost: 10000 },
  ],

  "Mahindra XUV 7XO": [
    { name: "Everest White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Galaxy Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Midnight Black", type: "Metallic", hex: "#1E1E1E", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Desert Myst", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
    { name: "Ruby Velvet", type: "Metallic", hex: "#7A2030", extraCost: 10000 },
    { name: "Galaxy Grey with Black Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Desert Myst with Black Roof", type: "Dual Tone", hex: "#C8B890", extraCost: 15000 },
    { name: "Midnight Black with Black Roof", type: "Dual Tone", hex: "#1E1E1E", extraCost: 15000 },
    { name: "Everest White with Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
  ],

  "Mahindra XUV400 EV": [
    { name: "Everest White", type: "Pearl", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Galaxy Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Napoli Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Arctic Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 10000 },
    { name: "Infinity Blue", type: "Metallic", hex: "#1A2A6A", extraCost: 10000 },
    { name: "Nebula Blue", type: "Metallic", hex: "#1A3070", extraCost: 10000 },
    { name: "Satin Copper", type: "Metallic", hex: "#B87840", extraCost: 20000 },
    { name: "Everest White Dual Tone", type: "Dual Tone", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Galaxy Grey Dual Tone", type: "Dual Tone", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Napoli Black Dual Tone", type: "Dual Tone", hex: "#2A2A2A", extraCost: 15000 },
    { name: "Arctic Blue Dual Tone", type: "Dual Tone", hex: "#1A4A7A", extraCost: 15000 },
    { name: "Nebula Blue Dual Tone", type: "Dual Tone", hex: "#1A3070", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // KIA — additional models
  // ─────────────────────────────────────────────────────────────
  "Kia Carens Clavis": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Sparkling Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Ivory Silver Gloss", type: "Metallic", hex: "#CCCCCC", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
  ],

  "Kia Carens Clavis EV": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Ivory Silver Matte", type: "Metallic", hex: "#CCCCCC", extraCost: 20000 },
    { name: "Dark Gun Metal", type: "Metallic", hex: "#3A3A3A", extraCost: 10000 },
  ],

  "Kia Carnival": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Fusion Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
  ],

  "Kia EV9": [
    { name: "Snow White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Panthera Metal", type: "Metallic", hex: "#3A3A3A", extraCost: 15000 },
    { name: "Pebble Gray", type: "Metallic", hex: "#8A8A8A", extraCost: 15000 },
    { name: "Ocean Blue", type: "Metallic", hex: "#1A3878", extraCost: 15000 },
  ],

  "Kia Syros": [
    { name: "Glacier White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 10000 },
    { name: "Aurora Black Pearl", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Sparkling Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Imperial Blue", type: "Metallic", hex: "#1A2E6A", extraCost: 10000 },
    { name: "Intense Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Pewter Olive", type: "Metallic", hex: "#626040", extraCost: 10000 },
    { name: "Frost Blue", type: "Metallic", hex: "#4A7A9A", extraCost: 10000 },
    { name: "Gravity Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // BMW
  // ─────────────────────────────────────────────────────────────
  "BMW 2 Series Gran Coupe": [
    { name: "Alpine White", type: "Solid", hex: "#F5F5F5", extraCost: 0 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 15000 },
    { name: "Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 15000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 15000 },
  ],

  "BMW 3 Series": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 15000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 15000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 15000 },
    { name: "Arctic Race Blue Metallic", type: "Metallic", hex: "#1A3868", extraCost: 15000 },
    { name: "Fire Red Metallic", type: "Metallic", hex: "#C42020", extraCost: 15000 },
  ],

  "BMW 3 Series Gran Limousine": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 15000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 15000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 15000 },
    { name: "Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 15000 },
  ],

  "BMW 5 Series": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 20000 },
    { name: "Phytonic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Sparkling Copper Grey Metallic", type: "Metallic", hex: "#8A7A6A", extraCost: 20000 },
    { name: "Oxide Grey Metallic", type: "Metallic", hex: "#6A6A68", extraCost: 20000 },
  ],

  "BMW 6 Series GT": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 20000 },
    { name: "Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 20000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
  ],

  "BMW 7 Series": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 25000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 25000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 25000 },
    { name: "Individual Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 30000 },
    { name: "Individual Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 30000 },
    { name: "Oxide Grey Metallic", type: "Metallic", hex: "#6A6A68", extraCost: 25000 },
  ],

  "BMW M2": [
    { name: "Alpine White", type: "Solid", hex: "#F5F5F5", extraCost: 0 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "M Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 20000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 20000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Fire Red Metallic", type: "Metallic", hex: "#C42020", extraCost: 20000 },
    { name: "M Sao Paulo Yellow", type: "Solid", hex: "#E8C820", extraCost: 20000 },
    { name: "M Zandvoort Blue", type: "Solid", hex: "#1A4A90", extraCost: 20000 },
  ],

  "BMW M4": [
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 25000 },
    { name: "Toronto Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 25000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 25000 },
    { name: "Sao Paulo Yellow Metallic", type: "Metallic", hex: "#E8C820", extraCost: 25000 },
    { name: "Isle of Man Green Metallic", type: "Metallic", hex: "#2A5A30", extraCost: 25000 },
    { name: "Individual Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 30000 },
    { name: "Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 25000 },
    { name: "Aventurine Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 25000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 25000 },
  ],

  "BMW M5": [
    { name: "M Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 25000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 25000 },
    { name: "Sophisto Grey Brilliant Effect Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 25000 },
    { name: "M Marina Bay Blue Metallic", type: "Metallic", hex: "#1A3870", extraCost: 25000 },
    { name: "M Isle of Man Green Metallic", type: "Metallic", hex: "#2A5A30", extraCost: 25000 },
    { name: "M Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 25000 },
    { name: "Fire Red Metallic", type: "Metallic", hex: "#C42020", extraCost: 25000 },
  ],

  "BMW M8": [
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 30000 },
    { name: "Marina Bay Blue Metallic", type: "Metallic", hex: "#1A3870", extraCost: 30000 },
    { name: "Isle of Man Green Metallic", type: "Metallic", hex: "#2A5A30", extraCost: 30000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 30000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 30000 },
    { name: "Aventurine Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 30000 },
    { name: "Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 30000 },
    { name: "Daytona Beach Blue Metallic", type: "Metallic", hex: "#1A4A78", extraCost: 30000 },
    { name: "Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 30000 },
  ],

  "BMW X1": [
    { name: "Alpine White", type: "Solid", hex: "#F5F5F5", extraCost: 0 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 15000 },
    { name: "M Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 15000 },
    { name: "Storm Bay Metallic", type: "Metallic", hex: "#4A6A78", extraCost: 15000 },
    { name: "Space Silver Metallic", type: "Metallic", hex: "#A8A8A6", extraCost: 15000 },
    { name: "Phytonic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
  ],

  "BMW X3": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Phytonic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Sophisto Grey Brilliant Effect Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
  ],

  "BMW X4": [
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 20000 },
  ],

  "BMW X5": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 20000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 20000 },
    { name: "Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 20000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
  ],

  "BMW X7": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 25000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 25000 },
    { name: "Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 25000 },
    { name: "Individual Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 30000 },
    { name: "Sparkling Copper Grey Metallic", type: "Metallic", hex: "#8A7A6A", extraCost: 25000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 25000 },
  ],

  "BMW XM": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 30000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 30000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 30000 },
    { name: "Toronto Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 30000 },
    { name: "Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 30000 },
    { name: "Mineral Blue Metallic", type: "Metallic", hex: "#1A4A6A", extraCost: 30000 },
    { name: "Cape York Green Metallic", type: "Metallic", hex: "#2A4A28", extraCost: 30000 },
  ],

  "BMW Z4": [
    { name: "Alpine White", type: "Solid", hex: "#F5F5F5", extraCost: 0 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "M Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 20000 },
    { name: "San Francisco Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 20000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Thundernight Metallic", type: "Metallic", hex: "#2A1A3A", extraCost: 20000 },
  ],

  "BMW i4": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
  ],

  "BMW i5": [
    { name: "Alpine White", type: "Solid", hex: "#F5F5F5", extraCost: 0 },
    { name: "M Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 20000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Sophisto Grey Brilliant Effect Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Phytonic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Oxide Grey Metallic", type: "Metallic", hex: "#6A6A68", extraCost: 20000 },
    { name: "M Brooklyn Grey Metallic", type: "Metallic", hex: "#8A8A86", extraCost: 20000 },
    { name: "Cape York Green Metallic", type: "Metallic", hex: "#2A4A28", extraCost: 20000 },
    { name: "Fire Red Metallic", type: "Metallic", hex: "#C42020", extraCost: 20000 },
    { name: "Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 20000 },
  ],

  "BMW i7": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 25000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 25000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 25000 },
    { name: "Individual Tanzanite Blue Metallic", type: "Metallic", hex: "#1A2850", extraCost: 30000 },
    { name: "Individual Dravit Grey Metallic", type: "Metallic", hex: "#5A5A58", extraCost: 30000 },
    { name: "Oxide Grey Metallic", type: "Metallic", hex: "#6A6A68", extraCost: 25000 },
    { name: "Aventurine Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 25000 },
  ],

  "BMW iX": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 20000 },
    { name: "Black Sapphire Metallic", type: "Metallic", hex: "#1C1C1E", extraCost: 20000 },
    { name: "Oxide Grey Metallic", type: "Metallic", hex: "#6A6A68", extraCost: 20000 },
    { name: "Phytonic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Individual Storm Bay Metallic", type: "Metallic", hex: "#4A6A78", extraCost: 25000 },
    { name: "Sophisto Grey Brilliant Effect Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Aventurine Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 20000 },
  ],

  "BMW iX1": [
    { name: "Mineral White Metallic", type: "Metallic", hex: "#E8E8E4", extraCost: 15000 },
    { name: "Carbon Black Metallic", type: "Metallic", hex: "#2A2A2C", extraCost: 15000 },
    { name: "Skyscraper Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 15000 },
    { name: "Portimao Blue Metallic", type: "Metallic", hex: "#1A3A6E", extraCost: 15000 },
    { name: "Sparkling Copper Grey Metallic", type: "Metallic", hex: "#8A7A6A", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // AUDI
  // ─────────────────────────────────────────────────────────────
  "Audi A4": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Navarra Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
    { name: "Progressive Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 15000 },
  ],

  "Audi A6": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Firmament Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 20000 },
    { name: "Madeira Brown Metallic", type: "Metallic", hex: "#5A3A2A", extraCost: 20000 },
  ],

  "Audi A8 L": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 25000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 25000 },
    { name: "Terra Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "Firmament Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 25000 },
    { name: "District Green Metallic", type: "Metallic", hex: "#2A4A30", extraCost: 25000 },
    { name: "Floret Silver Metallic", type: "Metallic", hex: "#C0C0BE", extraCost: 25000 },
    { name: "Vesuvius Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
  ],

  "Audi Q3": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Nano Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Navarra Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
    { name: "Pulse Orange", type: "Solid", hex: "#E06020", extraCost: 0 },
  ],

  "Audi Q3 Sportback": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 15000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Daytona Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Navarra Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
    { name: "Progressive Red", type: "Solid", hex: "#8A1A20", extraCost: 0 },
  ],

  "Audi Q5": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Navarra Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "District Green Metallic", type: "Metallic", hex: "#2A4A30", extraCost: 20000 },
  ],

  "Audi Q7": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Samurai Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Waitomo Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 20000 },
    { name: "Sakhir Gold Metallic", type: "Metallic", hex: "#8A7A40", extraCost: 20000 },
  ],

  "Audi Q8": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 25000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Satellite Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Waitomo Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 25000 },
    { name: "Sakhir Gold Metallic", type: "Metallic", hex: "#8A7A40", extraCost: 25000 },
    { name: "Samurai Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 25000 },
  ],

  "Audi Q8 Sportback e-tron": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Plasma Blue Metallic", type: "Metallic", hex: "#1A5A8A", extraCost: 20000 },
    { name: "Chronos Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Siam Beige Metallic", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
    { name: "Soneira Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 20000 },
    { name: "Madeira Brown Metallic", type: "Metallic", hex: "#5A3A2A", extraCost: 20000 },
    { name: "Magnet Grey", type: "Metallic", hex: "#4A4A4A", extraCost: 20000 },
  ],

  "Audi Q8 e-tron": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Manhattan Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Plasma Blue Metallic", type: "Metallic", hex: "#1A5A8A", extraCost: 20000 },
    { name: "Chronos Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Siam Beige Metallic", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
    { name: "Soneira Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 20000 },
    { name: "Madeira Brown Metallic", type: "Metallic", hex: "#5A3A2A", extraCost: 20000 },
    { name: "Magnet Grey", type: "Metallic", hex: "#4A4A4A", extraCost: 20000 },
  ],

  "Audi RS Q8": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 30000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Daytona Grey Pearl Effect", type: "Pearl", hex: "#6A6A6A", extraCost: 30000 },
    { name: "Satellite Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 30000 },
    { name: "Waitomo Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 30000 },
    { name: "Ascari Blue Metallic", type: "Metallic", hex: "#1A2A60", extraCost: 30000 },
    { name: "Sakhir Gold Metallic", type: "Metallic", hex: "#8A7A40", extraCost: 30000 },
    { name: "Chilli Red Metallic", type: "Metallic", hex: "#C02020", extraCost: 30000 },
  ],

  "Audi RS e-tron GT": [
    { name: "Ibis White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Daytona Grey Pearl Effect", type: "Pearl", hex: "#6A6A6A", extraCost: 25000 },
    { name: "Suzuka Grey Metallic", type: "Metallic", hex: "#8A8A88", extraCost: 25000 },
    { name: "Floret Silver Metallic", type: "Metallic", hex: "#C0C0BE", extraCost: 25000 },
    { name: "Kemora Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Tango Red Metallic", type: "Metallic", hex: "#A01A20", extraCost: 25000 },
    { name: "Ascari Blue Metallic", type: "Metallic", hex: "#1A2A60", extraCost: 25000 },
    { name: "Tactics Green Metallic", type: "Metallic", hex: "#2A4A30", extraCost: 25000 },
  ],

  "Audi S5 Sportback": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 20000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Navarra Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Chronos Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Progressive Red Metallic", type: "Metallic", hex: "#8A1A20", extraCost: 20000 },
    { name: "District Green Metallic", type: "Metallic", hex: "#2A4A30", extraCost: 20000 },
    { name: "Ascari Blue Metallic", type: "Metallic", hex: "#1A2A60", extraCost: 20000 },
  ],

  "Audi SQ8": [
    { name: "Glacier White Metallic", type: "Metallic", hex: "#F0F0EE", extraCost: 30000 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Daytona Grey Pearl Effect", type: "Pearl", hex: "#6A6A6A", extraCost: 30000 },
    { name: "Waitomo Blue Metallic", type: "Metallic", hex: "#1A3A5A", extraCost: 30000 },
    { name: "Sakhir Gold Metallic", type: "Metallic", hex: "#8A7A40", extraCost: 30000 },
    { name: "Satellite Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 30000 },
    { name: "Samurai Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 30000 },
  ],

  "Audi e-tron GT": [
    { name: "Ibis White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Mythos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Daytona Grey Pearl Effect", type: "Pearl", hex: "#6A6A6A", extraCost: 25000 },
    { name: "Suzuka Grey Metallic", type: "Metallic", hex: "#8A8A88", extraCost: 25000 },
    { name: "Floret Silver Metallic", type: "Metallic", hex: "#C0C0BE", extraCost: 25000 },
    { name: "Kemora Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Tango Red Metallic", type: "Metallic", hex: "#A01A20", extraCost: 25000 },
    { name: "Ascari Blue Metallic", type: "Metallic", hex: "#1A2A60", extraCost: 25000 },
    { name: "Tactics Green Metallic", type: "Metallic", hex: "#2A4A30", extraCost: 25000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MERCEDES-BENZ
  // ─────────────────────────────────────────────────────────────
  "Mercedes-Benz A-Class": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Mountain Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Iridium Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
  ],

  "Mercedes-Benz AMG C 63": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
  ],

  "Mercedes-Benz AMG C43": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Selenite Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Sodalite Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Hi-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 25000 },
    { name: "Patagonia Red Bright", type: "Metallic", hex: "#8A1A28", extraCost: 20000 },
  ],

  "Mercedes-Benz AMG CLE 53": [
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 25000 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 0 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 25000 },
    { name: "Sun Yellow", type: "Solid", hex: "#E8C820", extraCost: 25000 },
    { name: "Patagonia Red Metallic", type: "Metallic", hex: "#8A1A28", extraCost: 25000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Spectral Blue Magno", type: "Metallic", hex: "#1A3A6A", extraCost: 30000 },
  ],

  "Mercedes-Benz AMG E 53 Cabriolet": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "Cavansite Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 25000 },
    { name: "Hi-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
  ],

  "Mercedes-Benz AMG EQS": [
    { name: "Designo Diamond White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Nautic Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 30000 },
    { name: "Graphite Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 30000 },
    { name: "Designo Selenite Grey Magno", type: "Metallic", hex: "#7A7A78", extraCost: 35000 },
    { name: "Designo Hyacinth Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 35000 },
  ],

  "Mercedes-Benz AMG GLC 43": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
  ],

  "Mercedes-Benz AMG GLE 53": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Selenite Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 25000 },
  ],

  "Mercedes-Benz AMG GT 4-Door Coupe": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Graphite Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 30000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 30000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 30000 },
  ],

  "Mercedes-Benz AMG GT Coupe": [
    { name: "Designo Diamond White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 35000 },
    { name: "Magnetite Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 30000 },
    { name: "Iridium Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 30000 },
    { name: "Selenite Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 30000 },
    { name: "Brilliant Blue Metallic", type: "Metallic", hex: "#1A3070", extraCost: 30000 },
    { name: "AMG Solarbeam", type: "Solid", hex: "#E8C820", extraCost: 35000 },
    { name: "Jupiter Red", type: "Solid", hex: "#C02020", extraCost: 30000 },
    { name: "Designo Hyacinth Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 35000 },
    { name: "AMG Green Hell Magno", type: "Metallic", hex: "#2A5A28", extraCost: 40000 },
    { name: "Designo Selenite Grey Magno", type: "Metallic", hex: "#7A7A78", extraCost: 35000 },
    { name: "Designo Iridium Silver Magno", type: "Metallic", hex: "#B0B0B0", extraCost: 35000 },
    { name: "Designo Brilliant Blue Magno", type: "Metallic", hex: "#1A3070", extraCost: 35000 },
  ],

  "Mercedes-Benz AMG S 63": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 30000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 30000 },
    { name: "Nautic Blue", type: "Metallic", hex: "#1A3060", extraCost: 30000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 30000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 30000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 35000 },
    { name: "Velvet Brown", type: "Metallic", hex: "#4A2A1A", extraCost: 30000 },
    { name: "Verde Silver", type: "Metallic", hex: "#8A9A88", extraCost: 30000 },
  ],

  "Mercedes-Benz AMG SL": [
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 30000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 0 },
    { name: "Patagonia Red Bright", type: "Metallic", hex: "#8A1A28", extraCost: 30000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 30000 },
    { name: "Hyper Blue Magno", type: "Metallic", hex: "#1A4A8A", extraCost: 35000 },
    { name: "Monza Grey Magno", type: "Metallic", hex: "#6A6A68", extraCost: 35000 },
  ],

  "Mercedes-Benz C-Class": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 15000 },
    { name: "Mojave Silver", type: "Metallic", hex: "#B0A898", extraCost: 15000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 15000 },
    { name: "Hi-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 20000 },
    { name: "Patagonia Red Bright", type: "Metallic", hex: "#8A1A28", extraCost: 15000 },
  ],

  "Mercedes-Benz CLE": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Hi-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 25000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 0 },
  ],

  "Mercedes-Benz CLE Cabriolet": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Hi-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
  ],

  "Mercedes-Benz E-Class": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Nautic Blue", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Verde Silver", type: "Metallic", hex: "#8A9A88", extraCost: 20000 },
  ],

  "Mercedes-Benz EQA": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Mountain Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
    { name: "Patagonia Red", type: "Metallic", hex: "#8A1A28", extraCost: 15000 },
  ],

  "Mercedes-Benz EQB": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Cosmos Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Mountain Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
    { name: "Designo Patagonia Red Metallic Bright", type: "Metallic", hex: "#8A1A28", extraCost: 20000 },
    { name: "Designo Mountain Grey Magno", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
  ],

  "Mercedes-Benz EQE SUV": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 25000 },
    { name: "Velvet Brown", type: "Metallic", hex: "#4A2A1A", extraCost: 25000 },
    { name: "Manufaktur Diamond White", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Manufaktur Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 30000 },
  ],

  "Mercedes-Benz EQS": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Diamond White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Opalite White", type: "Pearl", hex: "#F0F0F0", extraCost: 25000 },
  ],

  "Mercedes-Benz EQS SUV": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Selenite Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 25000 },
    { name: "Velvet Brown", type: "Metallic", hex: "#4A2A1A", extraCost: 25000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 25000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Black Lacquer", type: "Metallic", hex: "#0A0A0A", extraCost: 30000 },
  ],

  "Mercedes-Benz G-Class": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Classic Grey", type: "Solid", hex: "#7A7A78", extraCost: 0 },
    { name: "Dark Blue", type: "Metallic", hex: "#1A2850", extraCost: 25000 },
    { name: "Rubellite Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 25000 },
    { name: "Dark Green", type: "Metallic", hex: "#1A3A20", extraCost: 25000 },
  ],

  "Mercedes-Benz G-Class Electric": [
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 30000 },
    { name: "Opalite White Magno", type: "Metallic", hex: "#E8E8E6", extraCost: 35000 },
    { name: "Classic Grey", type: "Solid", hex: "#7A7A78", extraCost: 0 },
    { name: "South Seas Blue Magno", type: "Metallic", hex: "#1A4A6A", extraCost: 35000 },
  ],

  "Mercedes-Benz GLA": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Mountain Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Iridium Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Spectral Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
  ],

  "Mercedes-Benz GLC": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Mojave Silver", type: "Metallic", hex: "#B0A898", extraCost: 20000 },
    { name: "Nautic Blue", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
  ],

  "Mercedes-Benz GLE": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Selenite Grey Metallic", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "High-Tech Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Sodalite Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
  ],

  "Mercedes-Benz GLS": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
  ],

  "Mercedes-Benz Maybach EQS SUV": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 35000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 35000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 35000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 35000 },
    { name: "Sodalite Blue", type: "Metallic", hex: "#1A3060", extraCost: 35000 },
    { name: "Velvet Brown", type: "Metallic", hex: "#4A2A1A", extraCost: 35000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 40000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 35000 },
  ],

  "Mercedes-Benz Maybach GLS": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 35000 },
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 35000 },
    { name: "Sodalite Blue Metallic", type: "Metallic", hex: "#1A3060", extraCost: 35000 },
    { name: "Hyacinth Red Metallic", type: "Metallic", hex: "#6A1A28", extraCost: 35000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 35000 },
    { name: "Alpine Grey", type: "Solid", hex: "#8A8A88", extraCost: 35000 },
    { name: "Opalite White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 40000 },
  ],

  "Mercedes-Benz Maybach S-Class": [
    { name: "Designo Diamond White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 40000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 35000 },
    { name: "Nautic Blue", type: "Metallic", hex: "#1A3060", extraCost: 35000 },
    { name: "Emerald Green", type: "Metallic", hex: "#1A4A2A", extraCost: 35000 },
  ],

  "Mercedes-Benz Maybach SL 680": [
    { name: "White Magno", type: "Metallic", hex: "#E8E8E6", extraCost: 40000 },
    { name: "Garnet Red Metallic", type: "Metallic", hex: "#6A1A20", extraCost: 35000 },
  ],

  "Mercedes-Benz S-Class": [
    { name: "Designo Diamond White Bright", type: "Pearl", hex: "#F0F0F0", extraCost: 30000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "High-Tech Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Nautic Blue", type: "Metallic", hex: "#1A3060", extraCost: 25000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
  ],

  "Mercedes-Benz V-Class": [
    { name: "Obsidian Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Selenite Grey", type: "Metallic", hex: "#7A7A78", extraCost: 20000 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 20000 },
    { name: "Rock Crystal White", type: "Pearl", hex: "#F0F0EE", extraCost: 25000 },
    { name: "Cavansite Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Graphite Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Steel Blue", type: "Metallic", hex: "#4A5A6A", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // TOYOTA — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Toyota Fortuner Legender": [
    { name: "Platinum White Pearl with Black Roof", type: "Dual Tone", hex: "#EFEFED", extraCost: 20000 },
    { name: "Attitude Black with Orange Roof", type: "Dual Tone", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Super White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Phantom Brown", type: "Metallic", hex: "#5A3A20", extraCost: 15000 },
  ],

  "Toyota Hilux": [
    { name: "Super White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "White Pearl Crystal Shine", type: "Pearl", hex: "#EFEFED", extraCost: 15000 },
    { name: "Emotional Red", type: "Metallic", hex: "#C02020", extraCost: 15000 },
    { name: "Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Attitude Black", type: "Metallic", hex: "#2A2A2A", extraCost: 15000 },
  ],

  "Toyota Land Cruiser 300": [
    { name: "Precious White Pearl", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Attitude Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
  ],

  "Toyota Rumion": [
    { name: "Cafe White", type: "Solid", hex: "#F0EEE8", extraCost: 0 },
    { name: "Enticing Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Iconic Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Spunky Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 10000 },
    { name: "Rustic Brown", type: "Metallic", hex: "#7A5238", extraCost: 10000 },
  ],

  "Toyota Taisor": [
    { name: "Cafe White", type: "Solid", hex: "#F0EEE8", extraCost: 0 },
    { name: "Enticing Silver", type: "Metallic", hex: "#B8B8B8", extraCost: 10000 },
    { name: "Gaming Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Lucent Orange", type: "Metallic", hex: "#E06020", extraCost: 10000 },
    { name: "Sportin Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Bluish Black", type: "Metallic", hex: "#1C1F2B", extraCost: 10000 },
    { name: "Sportin Red with Midnight Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
    { name: "Enticing Silver with Midnight Black Roof", type: "Dual Tone", hex: "#B8B8B8", extraCost: 15000 },
    { name: "Cafe White with Midnight Black Roof", type: "Dual Tone", hex: "#F0EEE8", extraCost: 15000 },
  ],

  "Toyota Vellfire": [
    { name: "Platinum White Pearl", type: "Pearl", hex: "#EFEFED", extraCost: 20000 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Precious Metal", type: "Metallic", hex: "#8C8470", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // NISSAN — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Nissan Gravite": [
    { name: "Storm White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Blade Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 5000 },
    { name: "Metallic Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 5000 },
    { name: "Onyx Black", type: "Metallic", hex: "#2A2A2A", extraCost: 5000 },
    { name: "Forest Green", type: "Metallic", hex: "#2A5038", extraCost: 5000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // RENAULT — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Renault Duster": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Moonlight Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Stealth Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Sunset Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "River Blue", type: "Metallic", hex: "#1A4A8C", extraCost: 10000 },
    { name: "Jade Mountain Green", type: "Metallic", hex: "#2A5038", extraCost: 10000 },
    { name: "Pearl White with Stealth Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Sunset Red with Stealth Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
    { name: "River Blue with Stealth Black Roof", type: "Dual Tone", hex: "#1A4A8C", extraCost: 15000 },
    { name: "Jade Mountain Green with Stealth Black Roof", type: "Dual Tone", hex: "#2A5038", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // SKODA — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Skoda Kodiaq": [
    { name: "Moon White Metallic", type: "Metallic", hex: "#E8E8E6", extraCost: 15000 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 15000 },
    { name: "Steel Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Graphite Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 15000 },
    { name: "Magic Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Velvet Red Metallic", type: "Metallic", hex: "#7A2020", extraCost: 15000 },
    { name: "Race Blue Metallic", type: "Metallic", hex: "#1A2A5A", extraCost: 15000 },
    { name: "Bronx Gold Metallic", type: "Metallic", hex: "#8C7840", extraCost: 15000 },
  ],

  "Skoda Kylaq": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Brilliant Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 10000 },
    { name: "Carbon Steel", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Deep Black", type: "Metallic", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Lava Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Cherry Red", type: "Metallic", hex: "#A82020", extraCost: 10000 },
  ],

  "Skoda Octavia RS": [
    { name: "Candy White", type: "Solid", hex: "#F0EFEE", extraCost: 0 },
    { name: "Magic Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Velvet Red", type: "Metallic", hex: "#7A2020", extraCost: 20000 },
    { name: "Race Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 20000 },
    { name: "Mamba Green", type: "Metallic", hex: "#3A5A2A", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // VOLKSWAGEN — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Volkswagen Golf GTI": [
    { name: "Kings Red Metallic", type: "Metallic", hex: "#A82020", extraCost: 20000 },
    { name: "Moonstone Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 20000 },
    { name: "Oryx White Mother of Pearl Effect", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Grenadilla Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
  ],

  "Volkswagen Tayron R-Line": [
    { name: "Oryx White Mother of Pearl Effect", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Grenadilla Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Oyster Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Dolphin Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Nightshade Blue Metallic", type: "Metallic", hex: "#1A2A4A", extraCost: 20000 },
    { name: "Ultra Violet Metallic", type: "Metallic", hex: "#5A2A7A", extraCost: 20000 },
    { name: "Cipressino Green Metallic", type: "Metallic", hex: "#2A4A38", extraCost: 20000 },
  ],

  "Volkswagen Tiguan R-Line": [
    { name: "Oryx White Mother of Pearl Effect", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Grenadilla Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Oyster Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Nightshade Blue Metallic", type: "Metallic", hex: "#1A2A4A", extraCost: 20000 },
    { name: "Persimmon Red Metallic", type: "Metallic", hex: "#B82020", extraCost: 20000 },
    { name: "Cipressino Green Metallic", type: "Metallic", hex: "#2A4A38", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // VOLVO
  // ─────────────────────────────────────────────────────────────
  "Volvo EC40": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Fjord Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Cloud Blue", type: "Metallic", hex: "#6A8AA0", extraCost: 20000 },
    { name: "Sage Green", type: "Metallic", hex: "#6A7A5A", extraCost: 20000 },
    { name: "Fusion Red", type: "Metallic", hex: "#B82020", extraCost: 20000 },
  ],

  "Volvo EX30": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Cloud Blue", type: "Metallic", hex: "#6A8AA0", extraCost: 20000 },
    { name: "Sand Dune", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
    { name: "Vapour Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 20000 },
  ],

  "Volvo EX40": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Fjord Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Cloud Blue", type: "Metallic", hex: "#6A8AA0", extraCost: 20000 },
    { name: "Sage Green", type: "Metallic", hex: "#6A7A5A", extraCost: 20000 },
    { name: "Sand Dune", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
  ],

  "Volvo XC60": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Denim Blue", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Vapour Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 20000 },
    { name: "Bright Dusk", type: "Metallic", hex: "#6A5A4A", extraCost: 20000 },
    { name: "Platinum Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Mulberry Red", type: "Metallic", hex: "#6A2030", extraCost: 20000 },
  ],

  "Volvo XC90": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Onyx Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Denim Blue", type: "Metallic", hex: "#1A3060", extraCost: 20000 },
    { name: "Vapour Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 20000 },
    { name: "Bright Dusk", type: "Metallic", hex: "#6A5A4A", extraCost: 20000 },
    { name: "Mulberry Red", type: "Metallic", hex: "#6A2030", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // PORSCHE
  // ─────────────────────────────────────────────────────────────
  "Porsche 911": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Guards Red", type: "Solid", hex: "#C02020", extraCost: 0 },
    { name: "Racing Yellow", type: "Solid", hex: "#E8C800", extraCost: 0 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "GT Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Gentian Blue Metallic", type: "Metallic", hex: "#1A2A6A", extraCost: 25000 },
    { name: "Aventurine Green Metallic", type: "Metallic", hex: "#2A5038", extraCost: 25000 },
    { name: "Crayon", type: "Solid", hex: "#CACAC0", extraCost: 25000 },
    { name: "Shark Blue", type: "Metallic", hex: "#2A5080", extraCost: 25000 },
    { name: "Ice Grey Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Carmine Red", type: "Solid", hex: "#A01020", extraCost: 25000 },
    { name: "Slate Grey Neo", type: "Metallic", hex: "#6A6A6A", extraCost: 25000 },
    { name: "Lugano Blue", type: "Metallic", hex: "#1A3070", extraCost: 25000 },
    { name: "Arctic Grey", type: "Metallic", hex: "#9A9A9A", extraCost: 25000 },
  ],

  "Porsche Cayenne": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Carrara White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 25000 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Quartz Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Mahogany Metallic", type: "Metallic", hex: "#5A2A20", extraCost: 25000 },
    { name: "Moonlight Blue Metallic", type: "Metallic", hex: "#1A2A5A", extraCost: 25000 },
    { name: "Biskay Blue Metallic", type: "Metallic", hex: "#1A3A6A", extraCost: 25000 },
    { name: "Crayon", type: "Solid", hex: "#CACAC0", extraCost: 25000 },
  ],

  "Porsche Cayenne Coupe": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Carrara White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 25000 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Quartz Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Mahogany Metallic", type: "Metallic", hex: "#5A2A20", extraCost: 25000 },
    { name: "Moonlight Blue Metallic", type: "Metallic", hex: "#1A2A5A", extraCost: 25000 },
    { name: "Biskay Blue Metallic", type: "Metallic", hex: "#1A3A6A", extraCost: 25000 },
    { name: "Crayon", type: "Solid", hex: "#CACAC0", extraCost: 25000 },
    { name: "Lava Orange", type: "Metallic", hex: "#D06020", extraCost: 25000 },
  ],

  "Porsche Cayenne Electric": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Carrara White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 25000 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Algarve Blue Metallic", type: "Metallic", hex: "#1A3A6A", extraCost: 25000 },
    { name: "Crayon", type: "Solid", hex: "#CACAC0", extraCost: 25000 },
  ],

  "Porsche Macan": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Carrara White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 25000 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Gentian Blue Metallic", type: "Metallic", hex: "#1A2A6A", extraCost: 25000 },
    { name: "Papaya Metallic", type: "Metallic", hex: "#D07020", extraCost: 25000 },
    { name: "Copper Ruby Metallic", type: "Metallic", hex: "#7A3030", extraCost: 25000 },
  ],

  "Porsche Macan EV": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Ice Grey Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Gentian Blue Metallic", type: "Metallic", hex: "#1A2A6A", extraCost: 25000 },
    { name: "Frozen Blue Metallic", type: "Metallic", hex: "#4A7AA0", extraCost: 25000 },
    { name: "Aventurine Green Metallic", type: "Metallic", hex: "#2A5038", extraCost: 25000 },
    { name: "Oak Green Metallic", type: "Metallic", hex: "#3A4A30", extraCost: 25000 },
    { name: "Papaya Metallic", type: "Metallic", hex: "#D07020", extraCost: 25000 },
    { name: "Copper Ruby Metallic", type: "Metallic", hex: "#7A3030", extraCost: 25000 },
    { name: "Provence", type: "Metallic", hex: "#9A8AA0", extraCost: 25000 },
  ],

  "Porsche Panamera": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Carrara White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 25000 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Ice Grey Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Gentian Blue Metallic", type: "Metallic", hex: "#1A2A6A", extraCost: 25000 },
    { name: "Lugano Blue", type: "Metallic", hex: "#1A3070", extraCost: 25000 },
    { name: "Provence", type: "Metallic", hex: "#9A8AA0", extraCost: 25000 },
    { name: "Madeira Gold Metallic", type: "Metallic", hex: "#8C7830", extraCost: 25000 },
  ],

  "Porsche Taycan": [
    { name: "White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Jet Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Dolomite Silver Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Volcano Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Ice Grey Metallic", type: "Metallic", hex: "#B0B0B0", extraCost: 25000 },
    { name: "Gentian Blue Metallic", type: "Metallic", hex: "#1A2A6A", extraCost: 25000 },
    { name: "Frozenblue Metallic", type: "Metallic", hex: "#4A7AA0", extraCost: 25000 },
    { name: "Neptune Blue", type: "Metallic", hex: "#1A3A5A", extraCost: 25000 },
    { name: "Carmine Red", type: "Solid", hex: "#A01020", extraCost: 25000 },
    { name: "Frozenberry Metallic", type: "Metallic", hex: "#7A3050", extraCost: 25000 },
    { name: "Coffee Beige Metallic", type: "Metallic", hex: "#8A7060", extraCost: 25000 },
    { name: "Provence", type: "Metallic", hex: "#9A8AA0", extraCost: 25000 },
    { name: "Purple Sky Metallic", type: "Metallic", hex: "#4A2A5A", extraCost: 25000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // LEXUS
  // ─────────────────────────────────────────────────────────────
  "Lexus ES": [
    { name: "Sonic Quartz", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Graphite Black Glass Flake", type: "Pearl", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Sonic Chrome", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
  ],

  "Lexus LM": [
    { name: "Sonic Quartz", type: "Pearl", hex: "#F0EFEE", extraCost: 25000 },
    { name: "Graphite Black Glass Flake", type: "Pearl", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Sonic Titanium", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Sonic Agate", type: "Metallic", hex: "#5A3A30", extraCost: 25000 },
  ],

  "Lexus LX": [
    { name: "Sonic Quartz", type: "Pearl", hex: "#F0EFEE", extraCost: 25000 },
    { name: "Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Graphite Black", type: "Metallic", hex: "#2A2A2A", extraCost: 25000 },
    { name: "Sonic Titanium", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Manganese Luster", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
  ],

  "Lexus NX": [
    { name: "White Nova Glass Flake", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Graphite Black Glass Flake", type: "Pearl", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Sonic Titanium", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Sonic Chrome", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Radiant Red", type: "Metallic", hex: "#C02020", extraCost: 20000 },
    { name: "Heat Blue Contrast Layering", type: "Pearl", hex: "#1A3A7A", extraCost: 20000 },
    { name: "Moon Desert", type: "Metallic", hex: "#C8B890", extraCost: 20000 },
  ],

  "Lexus RX": [
    { name: "Sonic Quartz", type: "Pearl", hex: "#F0EFEE", extraCost: 20000 },
    { name: "White Nova Glass Flake", type: "Pearl", hex: "#EEEEED", extraCost: 20000 },
    { name: "Graphite Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Sonic Titanium", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Sonic Chrome", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Sonic Iridium", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Red Mica Crystal Shine", type: "Pearl", hex: "#B82020", extraCost: 20000 },
    { name: "Deep Blue Mica", type: "Pearl", hex: "#1A2A5A", extraCost: 20000 },
    { name: "Heat Blue Contrast Layering", type: "Pearl", hex: "#1A3A7A", extraCost: 20000 },
    { name: "Sonic Copper", type: "Metallic", hex: "#B87040", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // JEEP — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "Jeep Grand Cherokee": [
    { name: "Bright White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Diamond Black Crystal", type: "Pearl", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Rocky Mountain Pearl", type: "Pearl", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Velvet Red Pearl", type: "Pearl", hex: "#7A2020", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // LAND ROVER
  // ─────────────────────────────────────────────────────────────
  "Land Rover Defender": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Yulong White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 20000 },
    { name: "Santorini Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Eiger Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Carpathian Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Silicon Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Gondwana Stone Metallic", type: "Metallic", hex: "#8A7A60", extraCost: 20000 },
    { name: "Pangea Green Metallic", type: "Metallic", hex: "#3A4A38", extraCost: 20000 },
    { name: "Tasman Blue Metallic", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
    { name: "Sedona Red", type: "Metallic", hex: "#8A2020", extraCost: 20000 },
  ],

  "Land Rover Discovery": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Yulong White Metallic", type: "Metallic", hex: "#EAEAE8", extraCost: 20000 },
    { name: "Santorini Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Eiger Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Carpathian Grey Metallic", type: "Metallic", hex: "#5A5A5A", extraCost: 20000 },
    { name: "Hakuba Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 20000 },
    { name: "Lantau Bronze Metallic", type: "Metallic", hex: "#8A6830", extraCost: 20000 },
    { name: "Byron Blue Metallic", type: "Metallic", hex: "#1A2A5A", extraCost: 20000 },
    { name: "Portofino Blue Metallic", type: "Metallic", hex: "#1A3A7A", extraCost: 20000 },
    { name: "Sedona Red", type: "Metallic", hex: "#8A2020", extraCost: 20000 },
    { name: "Varesine Blue", type: "Metallic", hex: "#2A4A7A", extraCost: 20000 },
  ],

  "Land Rover Discovery Sport": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Santorini Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Eiger Grey Metallic", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Firenze Red Metallic", type: "Metallic", hex: "#8A2020", extraCost: 15000 },
    { name: "Portofino Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 15000 },
  ],

  "Land Rover Range Rover": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Santorini Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Eiger Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Hakuba Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 25000 },
    { name: "Lantau Bronze", type: "Metallic", hex: "#8A6830", extraCost: 25000 },
    { name: "Portofino Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 25000 },
    { name: "Belgravia Green", type: "Metallic", hex: "#2A4A38", extraCost: 25000 },
    { name: "Deep Satin Blue", type: "Metallic", hex: "#1A2040", extraCost: 25000 },
    { name: "Batumi Gold", type: "Metallic", hex: "#A08830", extraCost: 25000 },
  ],

  "Land Rover Range Rover Evoque": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Santorini Black", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Eiger Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Corinthian Bronze", type: "Metallic", hex: "#8A6830", extraCost: 20000 },
    { name: "Tribeca Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 20000 },
  ],

  "Land Rover Range Rover Sport": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Santorini Black", type: "Metallic", hex: "#1A1A1A", extraCost: 25000 },
    { name: "Eiger Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 25000 },
    { name: "Carpathian Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 25000 },
    { name: "Firenze Red", type: "Metallic", hex: "#8A2020", extraCost: 25000 },
    { name: "Portofino Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 25000 },
    { name: "Varesine Blue", type: "Metallic", hex: "#2A4A7A", extraCost: 25000 },
    { name: "Lantau Bronze", type: "Metallic", hex: "#8A6830", extraCost: 25000 },
    { name: "Giola Green", type: "Metallic", hex: "#2A5A40", extraCost: 25000 },
    { name: "Borasco Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 25000 },
    { name: "Charente Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 25000 },
    { name: "Sunrise Copper", type: "Metallic", hex: "#B87040", extraCost: 25000 },
  ],

  "Land Rover Range Rover Velar": [
    { name: "Fuji White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Santorini Black Metallic", type: "Metallic", hex: "#1A1A1A", extraCost: 20000 },
    { name: "Varesine Blue Metallic", type: "Metallic", hex: "#2A4A7A", extraCost: 20000 },
    { name: "Zadar Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 20000 },
    { name: "Arroios Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 20000 },
    { name: "Ostuni Pearl White", type: "Pearl", hex: "#EAEAE8", extraCost: 20000 },
    { name: "Batumi Gold", type: "Metallic", hex: "#A08830", extraCost: 20000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // MG MOTOR — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "MG Cyberster": [
    { name: "Irises Cyan", type: "Metallic", hex: "#1AA0A8", extraCost: 15000 },
    { name: "Flare Red with Black Roof", type: "Dual Tone", hex: "#C02020", extraCost: 15000 },
    { name: "Nuclear Yellow with Black Roof", type: "Dual Tone", hex: "#D4C020", extraCost: 15000 },
    { name: "Andes Grey with Flare Red Roof", type: "Dual Tone", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Modern Beige with Flare Red Roof", type: "Dual Tone", hex: "#C8B890", extraCost: 15000 },
  ],

  "MG Hector Plus": [
    { name: "Candy White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Havana Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Glaze Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Dune Brown", type: "Metallic", hex: "#7A5A38", extraCost: 10000 },
    { name: "Candy White with Starry Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 15000 },
  ],

  "MG M9": [
    { name: "Pearl White with Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 20000 },
    { name: "Metal Black", type: "Metallic", hex: "#2A2A2A", extraCost: 20000 },
    { name: "Concrete Grey with Black Roof", type: "Dual Tone", hex: "#8A8A8A", extraCost: 20000 },
  ],

  "MG Windsor EV": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Aurora Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 10000 },
    { name: "Starry Black", type: "Metallic", hex: "#2A2A2A", extraCost: 10000 },
    { name: "Celadon Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 10000 },
    { name: "Turquoise Green", type: "Metallic", hex: "#1A7A6A", extraCost: 10000 },
    { name: "Glaze Red", type: "Metallic", hex: "#C02020", extraCost: 10000 },
    { name: "Clay Beige", type: "Metallic", hex: "#C8B890", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // CITRO\u00cbN
  // ─────────────────────────────────────────────────────────────
  "Citro\u00ebn Aircross": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Platinum Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 5000 },
    { name: "Cosmo Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 5000 },
    { name: "Perla Nera Black", type: "Pearl", hex: "#1A1A1A", extraCost: 5000 },
    { name: "Garnet Red", type: "Metallic", hex: "#8A2020", extraCost: 5000 },
    { name: "Deep Forest Green", type: "Metallic", hex: "#2A4030", extraCost: 5000 },
    { name: "Cosmo Blue with Polar White Roof", type: "Dual Tone", hex: "#1A3A7A", extraCost: 10000 },
    { name: "Garnet Red with Perla Nera Black Roof", type: "Dual Tone", hex: "#8A2020", extraCost: 10000 },
    { name: "Polar White with Perla Nera Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
  ],

  "Citro\u00ebn Basalt": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Platinum Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 5000 },
    { name: "Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Cosmos Blue", type: "Metallic", hex: "#1A3070", extraCost: 5000 },
    { name: "Perla Nera Black", type: "Pearl", hex: "#1A1A1A", extraCost: 5000 },
    { name: "Garnet Red", type: "Metallic", hex: "#8A2020", extraCost: 5000 },
    { name: "Garnet Red with Perla Nera Black Roof", type: "Dual Tone", hex: "#8A2020", extraCost: 10000 },
    { name: "Polar White with Perla Nera Black Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
  ],

  "Citro\u00ebn C3": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Platinum Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 5000 },
    { name: "Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Cosmo Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 5000 },
    { name: "Perla Nera Black", type: "Pearl", hex: "#1A1A1A", extraCost: 5000 },
    { name: "Garnet Red", type: "Metallic", hex: "#8A2020", extraCost: 5000 },
    { name: "Polar White with Platinum Grey Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Cosmo Blue with Polar White Roof", type: "Dual Tone", hex: "#1A3A7A", extraCost: 10000 },
    { name: "Garnet Red with Perla Nera Black Roof", type: "Dual Tone", hex: "#8A2020", extraCost: 10000 },
  ],

  "Citro\u00ebn C5 Aircross": [
    { name: "Pearl White", type: "Pearl", hex: "#F0EFEE", extraCost: 10000 },
    { name: "Cumulus Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 10000 },
    { name: "Eclipse Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 10000 },
    { name: "Pearl Nera Black", type: "Pearl", hex: "#1A1A1A", extraCost: 10000 },
    { name: "Pearl White with Black Roof", type: "Dual Tone", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Cumulus Grey with Black Roof", type: "Dual Tone", hex: "#8A8A8A", extraCost: 15000 },
    { name: "Eclipse Blue with Black Roof", type: "Dual Tone", hex: "#1A2A5A", extraCost: 15000 },
  ],

  "Citro\u00ebn eC3": [
    { name: "Polar White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Platinum Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 5000 },
    { name: "Steel Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 5000 },
    { name: "Zesty Orange", type: "Metallic", hex: "#E06020", extraCost: 5000 },
    { name: "Polar White with Zesty Orange Roof", type: "Dual Tone", hex: "#F0F0EE", extraCost: 10000 },
    { name: "Platinum Grey with Zesty Orange Roof", type: "Dual Tone", hex: "#8A8A8A", extraCost: 10000 },
    { name: "Steel Grey with Zesty Orange Roof", type: "Dual Tone", hex: "#6A6A6A", extraCost: 10000 },
    { name: "Zesty Orange with Polar White Roof", type: "Dual Tone", hex: "#E06020", extraCost: 10000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // ASTON MARTIN
  // ─────────────────────────────────────────────────────────────
  "Aston Martin DB12": [
    { name: "Jet Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Neutron White", type: "Pearl", hex: "#F0EFEE", extraCost: 50000 },
    { name: "Magnetic Silver Metallic", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Lightning Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 50000 },
    { name: "Xenon Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
    { name: "China Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 50000 },
    { name: "Plasma Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Concours Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Volcano Red Metallic", type: "Metallic", hex: "#A02020", extraCost: 50000 },
    { name: "Hyper Red", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Minotaur Green Metallic", type: "Metallic", hex: "#2A5038", extraCost: 50000 },
    { name: "Storm Purple", type: "Metallic", hex: "#4A2A5A", extraCost: 50000 },
    { name: "Magneto Bronze", type: "Metallic", hex: "#8A6830", extraCost: 50000 },
    { name: "Titanium Grey Metallic", type: "Metallic", hex: "#6A6A6A", extraCost: 50000 },
  ],

  "Aston Martin DBX": [
    { name: "Jet Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Magnetic Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Titanium Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 50000 },
    { name: "Plasma Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Hyper Red", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Iridescent Emerald", type: "Metallic", hex: "#2A5A38", extraCost: 50000 },
    { name: "Cosmos Orange", type: "Metallic", hex: "#D06020", extraCost: 50000 },
    { name: "Royal Indigo", type: "Metallic", hex: "#2A1A5A", extraCost: 50000 },
    { name: "Satin Xenon Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
  ],

  "Aston Martin Vanquish": [
    { name: "Jet Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Lightning Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 50000 },
    { name: "Plasma Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Hyper Red", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Iridescent Emerald", type: "Metallic", hex: "#2A5A38", extraCost: 50000 },
    { name: "Concours Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Buckinghamshire Green", type: "Metallic", hex: "#2A4A30", extraCost: 50000 },
    { name: "Storm Purple", type: "Metallic", hex: "#4A2A5A", extraCost: 50000 },
    { name: "Quantum Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 50000 },
    { name: "Onyx Black Metallic", type: "Metallic", hex: "#2A2A2A", extraCost: 50000 },
  ],

  "Aston Martin Vantage": [
    { name: "Jet Black", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Lightning Silver", type: "Metallic", hex: "#B0B0B0", extraCost: 50000 },
    { name: "Hyper Red", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "China Grey", type: "Metallic", hex: "#8A8A8A", extraCost: 50000 },
    { name: "Intense Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Appletree Green", type: "Metallic", hex: "#3A5A30", extraCost: 50000 },
    { name: "Diavolo Red", type: "Metallic", hex: "#A01020", extraCost: 50000 },
    { name: "Hammerhead Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Kopi Bronze", type: "Metallic", hex: "#8A6830", extraCost: 50000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // BENTLEY
  // ─────────────────────────────────────────────────────────────
  "Bentley Bentayga": [
    { name: "Glacier White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Beluga", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Moonbeam", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Thunder", type: "Metallic", hex: "#5A5A5A", extraCost: 50000 },
    { name: "Dark Sapphire", type: "Metallic", hex: "#1A2A4A", extraCost: 50000 },
    { name: "St. James' Red", type: "Solid", hex: "#8A2020", extraCost: 50000 },
    { name: "Onyx", type: "Metallic", hex: "#2A2A2A", extraCost: 50000 },
  ],

  "Bentley Continental GT": [
    { name: "Glacier White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Beluga", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Moonbeam", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Thunder", type: "Metallic", hex: "#5A5A5A", extraCost: 50000 },
    { name: "Sequin Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Black Crystal", type: "Pearl", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Extreme Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 50000 },
    { name: "Neptune", type: "Metallic", hex: "#1A4A6A", extraCost: 50000 },
    { name: "Azure Purple", type: "Metallic", hex: "#4A2A6A", extraCost: 50000 },
    { name: "Candy Red", type: "Metallic", hex: "#B02020", extraCost: 50000 },
  ],

  "Bentley Continental GTC": [
    { name: "Glacier White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Beluga", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Moonbeam", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Thunder", type: "Metallic", hex: "#5A5A5A", extraCost: 50000 },
    { name: "Sequin Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Black Crystal", type: "Pearl", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Extreme Silver", type: "Metallic", hex: "#C8C8C8", extraCost: 50000 },
    { name: "Neptune", type: "Metallic", hex: "#1A4A6A", extraCost: 50000 },
    { name: "Azure Purple", type: "Metallic", hex: "#4A2A6A", extraCost: 50000 },
    { name: "Candy Red", type: "Metallic", hex: "#B02020", extraCost: 50000 },
  ],

  "Bentley Flying Spur": [
    { name: "Glacier White", type: "Solid", hex: "#F0F0EE", extraCost: 0 },
    { name: "Beluga", type: "Solid", hex: "#1A1A1A", extraCost: 0 },
    { name: "Moonbeam", type: "Metallic", hex: "#C0C0C0", extraCost: 50000 },
    { name: "Thunder", type: "Metallic", hex: "#5A5A5A", extraCost: 50000 },
    { name: "Sequin Blue", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Black Crystal", type: "Pearl", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Titan Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 50000 },
    { name: "Anthracite", type: "Metallic", hex: "#3A3A3A", extraCost: 50000 },
    { name: "Moroccan Blue", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Candy Red", type: "Metallic", hex: "#B02020", extraCost: 50000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // LAMBORGHINI
  // ─────────────────────────────────────────────────────────────
  "Lamborghini Huracan EVO": [
    { name: "Bianco Monocerus", type: "Pearl", hex: "#F0F0EE", extraCost: 50000 },
    { name: "Nero Noctis", type: "Metallic", hex: "#1A1A1A", extraCost: 50000 },
    { name: "Grigio Nimbus", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
    { name: "Rosso Mars", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Verde Mantis", type: "Pearl", hex: "#3A8A30", extraCost: 50000 },
    { name: "Giallo Inti", type: "Pearl", hex: "#D4C020", extraCost: 50000 },
    { name: "Arancio Borealis", type: "Pearl", hex: "#E07020", extraCost: 50000 },
    { name: "Blu Astraeus", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Blu Eleos", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Bianco Icarus", type: "Pearl", hex: "#EEEEED", extraCost: 50000 },
  ],

  "Lamborghini Revuelto": [
    { name: "Bianco Monocerus", type: "Pearl", hex: "#F0F0EE", extraCost: 50000 },
    { name: "Nero Noctis", type: "Metallic", hex: "#1A1A1A", extraCost: 50000 },
    { name: "Nero Helene", type: "Metallic", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Grigio Nimbus", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
    { name: "Grigio Keres", type: "Metallic", hex: "#6A6A6A", extraCost: 50000 },
    { name: "Rosso Mars", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Rosso Anteros", type: "Metallic", hex: "#A01020", extraCost: 50000 },
    { name: "Verde Mantis", type: "Pearl", hex: "#3A8A30", extraCost: 50000 },
    { name: "Verde Lares", type: "Metallic", hex: "#2A5A30", extraCost: 50000 },
    { name: "Giallo Inti", type: "Pearl", hex: "#D4C020", extraCost: 50000 },
    { name: "Giallo Auge", type: "Pearl", hex: "#D4A800", extraCost: 50000 },
    { name: "Arancio Borealis", type: "Pearl", hex: "#E07020", extraCost: 50000 },
    { name: "Blu Astraeus", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Blu Eleos", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Bianco Icarus", type: "Pearl", hex: "#EEEEED", extraCost: 50000 },
    { name: "Marrone Alcestis", type: "Metallic", hex: "#5A3A20", extraCost: 50000 },
  ],

  "Lamborghini Temerario": [
    { name: "Blu Marinus", type: "Metallic", hex: "#1A3A6A", extraCost: 50000 },
    { name: "Verde Mercurius", type: "Metallic", hex: "#2A5A38", extraCost: 50000 },
    { name: "Bianco Monocerus", type: "Pearl", hex: "#F0F0EE", extraCost: 50000 },
    { name: "Nero Noctis", type: "Metallic", hex: "#1A1A1A", extraCost: 50000 },
    { name: "Grigio Nimbus", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
    { name: "Rosso Mars", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Verde Mantis", type: "Pearl", hex: "#3A8A30", extraCost: 50000 },
    { name: "Giallo Inti", type: "Pearl", hex: "#D4C020", extraCost: 50000 },
    { name: "Arancio Borealis", type: "Pearl", hex: "#E07020", extraCost: 50000 },
    { name: "Blu Astraeus", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Bianco Icarus", type: "Pearl", hex: "#EEEEED", extraCost: 50000 },
    { name: "Nero Helene", type: "Metallic", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Blu Eleos", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Giallo Auge", type: "Pearl", hex: "#D4A800", extraCost: 50000 },
  ],

  "Lamborghini Urus": [
    { name: "Bianco Monocerus", type: "Pearl", hex: "#F0F0EE", extraCost: 50000 },
    { name: "Nero Noctis", type: "Metallic", hex: "#1A1A1A", extraCost: 50000 },
    { name: "Nero Helene", type: "Metallic", hex: "#2A2A2A", extraCost: 50000 },
    { name: "Grigio Nimbus", type: "Metallic", hex: "#7A7A7A", extraCost: 50000 },
    { name: "Grigio Keres", type: "Metallic", hex: "#6A6A6A", extraCost: 50000 },
    { name: "Rosso Mars", type: "Metallic", hex: "#C02020", extraCost: 50000 },
    { name: "Rosso Anteros", type: "Metallic", hex: "#A01020", extraCost: 50000 },
    { name: "Verde Mantis", type: "Pearl", hex: "#3A8A30", extraCost: 50000 },
    { name: "Verde Lares", type: "Metallic", hex: "#2A5A30", extraCost: 50000 },
    { name: "Giallo Inti", type: "Pearl", hex: "#D4C020", extraCost: 50000 },
    { name: "Giallo Auge", type: "Pearl", hex: "#D4A800", extraCost: 50000 },
    { name: "Arancio Borealis", type: "Pearl", hex: "#E07020", extraCost: 50000 },
    { name: "Blu Astraeus", type: "Metallic", hex: "#1A3A7A", extraCost: 50000 },
    { name: "Blu Eleos", type: "Metallic", hex: "#1A2A5A", extraCost: 50000 },
    { name: "Bianco Icarus", type: "Pearl", hex: "#EEEEED", extraCost: 50000 },
    { name: "Marrone Alcestis", type: "Metallic", hex: "#5A3A20", extraCost: 50000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // BYD — additional models (batch 2)
  // ─────────────────────────────────────────────────────────────
  "BYD Sealion 7": [
    { name: "Aurora White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Atlantis Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Shark Grey", type: "Metallic", hex: "#5A5A5A", extraCost: 15000 },
  ],

  "BYD eMAX 7": [
    { name: "Crystal White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Cosmos Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Harbour Grey", type: "Metallic", hex: "#6A6A6A", extraCost: 15000 },
    { name: "Quartz Blue", type: "Metallic", hex: "#1A4A7A", extraCost: 15000 },
  ],

  // ─────────────────────────────────────────────────────────────
  // VINFAST
  // ─────────────────────────────────────────────────────────────
  "VinFast VF 6": [
    { name: "Infinity Blanc", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Jet Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Desat Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Zenith Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Crimson Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
    { name: "Urban Mint", type: "Metallic", hex: "#5A9A7A", extraCost: 15000 },
  ],

  "VinFast VF 7": [
    { name: "Infinity Blanc", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Jet Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Desat Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Zenith Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Crimson Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
    { name: "Urban Mint", type: "Metallic", hex: "#5A9A7A", extraCost: 15000 },
  ],

  "VinFast VF 8": [
    { name: "Lux White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Brahminy Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
    { name: "Desat Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Jet Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Zenith Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
  ],

  "VinFast VF 9": [
    { name: "Lux White", type: "Pearl", hex: "#F0EFEE", extraCost: 15000 },
    { name: "Brahminy Red", type: "Metallic", hex: "#B82020", extraCost: 15000 },
    { name: "Desat Silver", type: "Metallic", hex: "#C0C0C0", extraCost: 15000 },
    { name: "Jet Black", type: "Metallic", hex: "#1A1A1A", extraCost: 15000 },
    { name: "Zenith Grey", type: "Metallic", hex: "#7A7A7A", extraCost: 15000 },
    { name: "Blue", type: "Metallic", hex: "#1A3A6A", extraCost: 15000 },
  ],
};
