#!/bin/bash

# Vercel Deployment Setup Script
# Run this before deploying to ensure everything is ready

echo "🚀 Preparing for Vercel deployment..."

# Check if .env exists and has real values
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "💡 Copy .env.example to .env and configure your settings"
    exit 1
fi

# Check for placeholder values
if grep -q "your-app-password" .env; then
    echo "⚠️  WARNING: Email credentials not configured!"
    echo "💡 Update EMAIL_USER and EMAIL_PASS in .env file"
    echo "💡 Get Gmail app password: https://support.google.com/accounts/answer/185833"
fi

# Check if vercel.json exists
if [ ! -f vercel.json ]; then
    echo "❌ vercel.json not found!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests if available
if [ -f "test-backend.js" ]; then
    echo "🧪 Running backend tests..."
    node test-backend.js
fi

echo ""
echo "✅ Ready for Vercel deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push changes to GitHub: git add . && git commit -m 'Ready for Vercel' && git push"
echo "2. Go to vercel.com and import your GitHub repository"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - EMAIL_USER"
echo "   - EMAIL_PASS"
echo "   - CORS_ORIGIN (set to your Vercel domain)"
echo "4. Deploy!"
echo ""
echo "📖 See VERCEL-DEPLOYMENT.md for detailed instructions"