#!/bin/bash

# Directory to save logos
LOGO_DIR="public/assets/logos"
mkdir -p "$LOGO_DIR"

# Base URL for the logos (using the optimized versions for better performance/transparency)
BASE_URL="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized"

# List of "Brand:Filename"
brands=(
    "Toyota:toyota.png"
    "Honda:honda.png"
    "Ford:ford.png"
    "Chevrolet:chevrolet.png"
    "BMW:bmw.png"
    "Mercedes-Benz:mercedes-benz.png"
    "Nissan:nissan.png"
    "Hyundai:hyundai.png"
    "Volkswagen:volkswagen.png"
    "Mazda:mazda.png"
    "Subaru:subaru.png"
    "Kia:kia.png"
    "Lexus:lexus.png"
    "Acura:acura.png"
    "Audi:audi.png"
    "Jeep:jeep.png"
    "Ram:ram.png"
    "GMC:gmc.png"
    "Tesla:tesla.png"
)

echo "Downloading logos to $LOGO_DIR..."

for entry in "${brands[@]}"; do
    brand="${entry%%:*}"
    filename="${entry##*:}"
    url="$BASE_URL/$filename"
    filepath="$LOGO_DIR/$filename"

    echo "Downloading $brand logo..."
    if curl -s -f -o "$filepath" "$url"; then
        echo "✅ $brand logo downloaded successfully."
    else
        echo "❌ Failed to download $brand logo from $url"
    fi
done

echo "Download process complete."

