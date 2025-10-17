#!/bin/bash

# Add environment variables to Vercel
echo "Adding environment variables to Vercel..."

# Read .env file and add each variable
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  if [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
    echo "Adding $key..."
    echo "$value" | vercel env add "$key" production --yes 2>/dev/null || echo "Failed to add $key or already exists"
  fi
done < .env

echo "Environment variables setup complete!"