#!/bin/bash

# 🚀 Deployment Test Script
# Run this to test your deployment locally before deploying

echo "🔍 Testing E-commerce Platform Deployment..."

# Test 1: Frontend Build
echo "📦 Testing frontend build..."
cd frontend
npm run build

if [ -d "dist" ]; then
    echo "✅ Frontend build successful - dist folder created"
else
    echo "❌ Frontend build failed - no dist folder"
    exit 1
fi

# Test 2: Check if index.html exists
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found in dist folder"
else
    echo "❌ index.html missing in dist folder"
    exit 1
fi

# Test 3: Check if assets folder exists
if [ -d "dist/assets" ]; then
    echo "✅ Assets folder found"
else
    echo "❌ Assets folder missing"
fi

# Test 4: API Structure
echo "🔌 Testing API structure..."
cd ../api

if [ -f "index.js" ]; then
    echo "✅ API index.js found"
else
    echo "❌ API index.js missing"
    exit 1
fi

# Test 5: Check if node_modules exist in API
if [ -d "node_modules" ]; then
    echo "✅ API dependencies installed"
else
    echo "⚠️  API dependencies not installed - run 'npm install' in api folder"
fi

# Test 6: Vercel configuration
cd ..
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configuration found"
else
    echo "❌ vercel.json missing"
    exit 1
fi

echo ""
echo "🎉 All deployment tests passed!"
echo ""
echo "📋 Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Fix deployment issues'"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy to Vercel: vercel --prod"
echo ""
echo "🔗 Test these URLs after deployment:"
echo "- https://your-app.vercel.app/"
echo "- https://your-app.vercel.app/login"
echo "- https://your-app.vercel.app/api/auth/me"
echo ""
