import os

# Map downloaded files to their brand names
hero_dir = "public/assets/hero"
files = os.listdir(hero_dir)

# Brand slug to display name mapping (from automotive-brands.ts)
SLUG_TO_BRAND = {
    "maruti-suzuki": "Maruti Suzuki",
    "tata-motors": "Tata Motors",
    "mahindra": "Mahindra",
    "hyundai": "Hyundai",
    "honda": "Honda",
    "toyota": "Toyota",
    "kia": "Kia",
    "renault": "Renault",
    "nissan": "Nissan",
    "volkswagen": "Volkswagen",
    "skoda": "Skoda",
    "mg": "MG",
    "jeep": "Jeep",
    "citroen": "Citroen",
    "force-motors": "Force Motors",
    "isuzu": "Isuzu",
    "mercedes-benz": "Mercedes-Benz",
    "bmw": "BMW",
    "audi": "Audi",
    "jaguar": "Jaguar",
    "land-rover": "Land Rover",
    "volvo": "Volvo",
    "lexus": "Lexus",
    "porsche": "Porsche",
    "bentley": "Bentley",
    "lamborghini": "Lamborghini",
    "byd": "BYD",
    "tesla": "Tesla",
    "ola": "Ola Electric",
    "ather": "Ather Energy"
}

print("const HERO_IMAGES: Record<string, string> = {")
for slug, brand_name in SLUG_TO_BRAND.items():
    # Find the file for this slug
    matching_files = [f for f in files if f.startswith(slug) and not f.startswith('.')]
    if matching_files:
        file = matching_files[0]
        print(f'    "{brand_name}": "/assets/hero/{file}",')
    else:
        print(f'    // "{brand_name}": missing')
print("};")
