#!/bin/bash

# Numy Luxury Real Estate - Production Deployment Script
# Run with: bash deploy.sh

echo "🚀 Deploying Numy Luxury Real Estate Website"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "💡 Copy .env.example to .env and configure your settings"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if email is configured
if grep -q "your-app-password" .env; then
    echo "⚠️  WARNING: Email credentials not configured!"
    echo "💡 Update EMAIL_USER and EMAIL_PASS in .env file"
fi

# Run tests if available
if [ -f "test-backend.js" ]; then
    echo "🧪 Running backend tests..."
    npm test
fi

# Start the server
echo "🌟 Starting production server..."
echo "📧 Make sure your email credentials are configured in .env"
echo "🌐 Server will be available at http://localhost:3000"
echo ""

npm start