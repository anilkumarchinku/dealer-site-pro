import os
import re

# Brand list from automotive-brands.ts (extracted manually or we can parse it, but list is short enough to copy relevant ones or just logic)
# Actually, let's just list the directory and simulate the transformation.
logos_dir = "/Users/anilkumarkolukulapalli/projects/cyepro/dealersite pro/dealer-site-pro/public/assets/logos"
existing_logos = set(os.listdir(logos_dir))

brands = [
    'Maruti Suzuki', 'Tata Motors', 'Mahindra', 'Hyundai', 'Honda', 'Toyota', 'Kia', 
    'Renault', 'Nissan', 'Volkswagen', 'Skoda', 'MG', 'Jeep', 'Citroen', 
    'Force Motors', 'Isuzu', 'Mercedes-Benz', 'BMW', 'Audi', 'Jaguar', 
    'Land Rover', 'Volvo', 'Lexus', 'Porsche', 'Bentley', 'Lamborghini', 
    'BYD', 'Tesla'
]

print("Checking logo existence...")
for brand in brands:
    # Logic from page.tsx: primaryBrand.toLowerCase().replace(/\s+/g, '-')
    filename = brand.lower().replace(' ', '-') + ".png"
    
    if filename not in existing_logos:
        print(f"MISSING: {brand} -> Expected {filename}")
    else:
        # print(f"OK: {brand} -> {filename}")
        pass

print("Check complete.")
