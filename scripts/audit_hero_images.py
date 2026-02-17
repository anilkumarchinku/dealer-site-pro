
import os
import shutil

# Expected brand slugs
BRANDS = [
    # Mass Market
    "maruti-suzuki", "tata-motors", "mahindra", "hyundai", "honda",
    "toyota", "kia", "renault", "nissan", "volkswagen",
    # Mid-Premium & Utility
    "skoda", "mg", "jeep", "citroen", "force-motors", "isuzu",
    # Luxury
    "mercedes-benz", "bmw", "audi", "jaguar", "land-rover",
    "volvo", "lexus", "porsche", "bentley", "lamborghini",
    # New Age / EV
    "byd", "tesla", "ola", "ather"
]

HERO_DIR = "public/assets/hero"
# Map meant to unify loose filenames to strict slugs
# e.g. "maruti-suzuki_hero.jpg" -> "maruti-suzuki.jpg"
def normalize_files():
    files = os.listdir(HERO_DIR)
    for f in files:
        if f.startswith("."): continue
        
        name, ext = os.path.splitext(f)
        # remove _hero suffix if present
        if "_hero" in name:
            new_name = name.replace("_hero", "")
            print(f"Renaming {f} -> {new_name}{ext}")
            os.rename(os.path.join(HERO_DIR, f), os.path.join(HERO_DIR, new_name + ext))

def audit():
    print("--- AUDIT REPORT ---")
    files = os.listdir(HERO_DIR)
    present = set()
    for f in files:
        if f.startswith("."): continue
        name, _ = os.path.splitext(f)
        # Check if the file starts with a brand slug
        for brand in BRANDS:
            if name == brand:
                present.add(brand)
                break
    
    missing = [b for b in BRANDS if b not in present]
    
    print(f"Found: {len(present)}/{len(BRANDS)}")
    print(f"Missing: {missing}")
    
    print("\nExisting Files:")
    for f in sorted(files):
        if not f.startswith("."):
            print(f" - {f}")

if __name__ == "__main__":
    normalize_files()
    audit()
