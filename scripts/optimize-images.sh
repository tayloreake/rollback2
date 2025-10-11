#!/bin/bash

# Image Optimization Script for Hero Images
# This script optimizes large hero images to improve LCP

echo "🖼️  Taylor Movers - Image Optimization Script"
echo "============================================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing..."
    echo "Run: sudo apt-get install imagemagick"
    exit 1
fi

# Directory containing hero images
HERO_DIR="public/assets/taylor-hero-images"
BACKUP_DIR="public/assets/taylor-hero-images/originals"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📁 Processing images in: $HERO_DIR"
echo ""

# Counter
count=0

# Process each JPG file
for img in "$HERO_DIR"/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        
        # Skip if already optimized (check if backup exists)
        if [ -f "$BACKUP_DIR/$filename" ]; then
            echo "⏭️  Skipping $filename (already optimized)"
            continue
        fi
        
        # Get original size
        original_size=$(du -h "$img" | cut -f1)
        
        echo "🔄 Processing: $filename"
        echo "   Original size: $original_size"
        
        # Create backup
        cp "$img" "$BACKUP_DIR/$filename"
        echo "   ✅ Backup created"
        
        # Optimize image
        # - Resize to max 1920px width
        # - Quality 75%
        # - Strip metadata
        # - Progressive JPEG
        convert "$img" \
            -resize '1920x1080^' \
            -gravity center \
            -extent 1920x1080 \
            -quality 75 \
            -strip \
            -interlace Plane \
            "$img"
        
        # Get new size
        new_size=$(du -h "$img" | cut -f1)
        
        echo "   ✅ Optimized size: $new_size"
        echo ""
        
        ((count++))
    fi
done

echo "============================================="
echo "✨ Optimization complete!"
echo "📊 Total images optimized: $count"
echo ""
echo "💡 Tips:"
echo "   - Original images backed up to: $BACKUP_DIR"
echo "   - To restore originals: cp $BACKUP_DIR/* $HERO_DIR/"
echo "   - Rebuild your app: npm run build"
echo ""
