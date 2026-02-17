#!/bin/bash

# Directory to save hero images
HERO_DIR="public/assets/hero"
mkdir -p "$HERO_DIR"

echo "Downloading hero images to $HERO_DIR..."

# Toyota (already downloaded)
echo "✅ Toyota hero image already exists."

# Kia (already downloaded)
echo "✅ Kia hero image already exists."

# Mercedes-Benz (already downloaded)
echo "✅ Mercedes-Benz hero image already exists."

# Audi (already downloaded)
echo "✅ Audi hero image already exists."

# Honda - Official Honda India Website
echo "Downloading Honda hero image..."
curl -s -f -o "$HERO_DIR/honda_hero.jpg" "https://www.hondacarindia.com/web-data/home/banner/Elevate%20ADV-Desktop.jpg"
if [ $? -eq 0 ]; then
    echo "✅ Honda hero image downloaded successfully."
else
    echo "❌ Failed to download Honda hero image."
fi

# Jeep - Official Jeep India Website  
echo "Downloading Jeep hero image..."
curl -s -f -o "$HERO_DIR/jeep_hero.jpg" "https://www.jeep-india.com/content/dam/cross-regional/apac/jeep/en_in/BTR-2025-Logo.jpg"
if [ $? -eq 0 ]; then
    echo "✅ Jeep hero image downloaded successfully."
else
    echo "❌ Failed to download Jeep hero image."
fi

# Lexus - Official Lexus India Website
echo "Downloading Lexus hero image..."
curl -s -f -o "$HERO_DIR/lexus_hero.png" "https://www.lexusindia.co.in/wp-content/uploads/2025/06/lx_overtrail_home2.png"
if [ $? -eq 0 ]; then
    echo "✅ Lexus hero image downloaded successfully."
else
    echo "❌ Failed to download Lexus hero image."
fi

# Hyundai - Pexels (Royalty-Free Stock Photo)
echo "Downloading Hyundai hero image..."
curl -s -L -o "$HERO_DIR/hyundai_hero.jpg" "https://images.pexels.com/photos/3848636/pexels-photo-3848636.jpeg?auto=compress&cs=tinysrgb&w=1920"
if [ $? -eq 0 ]; then
    echo "✅ Hyundai hero image downloaded successfully."
else
    echo "❌ Failed to download Hyundai hero image."
fi

# Volkswagen - Pexels (Royalty-Free Stock Photo)
echo "Downloading Volkswagen hero image..."
curl -s -L -o "$HERO_DIR/volkswagen_hero.jpg" "https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=1920"
if [ $? -eq 0 ]; then
    echo "✅ Volkswagen hero image downloaded successfully."
else
    echo "❌ Failed to download Volkswagen hero image."
fi

# BMW - Pexels (Royalty-Free Stock Photo)
echo "Downloading BMW hero image..."
curl -s -L -o "$HERO_DIR/bmw_hero.jpg" "https://images.pexels.com/photos/3954895/pexels-photo-3954895.jpeg?auto=compress&cs=tinysrgb&w=1920"
if [ $? -eq 0 ]; then
    echo "✅ BMW hero image downloaded successfully."
else
    echo "❌ Failed to download BMW hero image."
fi

# Nissan - Pexels (Royalty-Free Stock Photo)
echo "Downloading Nissan hero image..."
curl -s -L -o "$HERO_DIR/nissan_hero.jpg" "https://images.pexels.com/photos/3954659/pexels-photo-3954659.jpeg?auto=compress&cs=tinysrgb&w=1920"
if [ $? -eq 0 ]; then
    echo "✅ Nissan hero image downloaded successfully."
else
    echo "❌ Failed to download Nissan hero image."
fi

echo "Download process complete."





