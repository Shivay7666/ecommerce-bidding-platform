@echo off
echo 🔍 Testing E-commerce Platform Deployment...

REM Test 1: Frontend Build
echo 📦 Testing frontend build...
cd frontend
call npm run build

if exist "dist\" (
    echo ✅ Frontend build successful - dist folder created
) else (
    echo ❌ Frontend build failed - no dist folder
    pause
    exit /b 1
)

REM Test 2: Check if index.html exists
if exist "dist\index.html" (
    echo ✅ index.html found in dist folder
) else (
    echo ❌ index.html missing in dist folder
    pause
    exit /b 1
)

REM Test 3: Check if assets folder exists
if exist "dist\assets\" (
    echo ✅ Assets folder found
) else (
    echo ❌ Assets folder missing
)

REM Test 4: API Structure
echo 🔌 Testing API structure...
cd ..\api

if exist "index.js" (
    echo ✅ API index.js found
) else (
    echo ❌ API index.js missing
    pause
    exit /b 1
)

REM Test 5: Check if node_modules exist in API
if exist "node_modules\" (
    echo ✅ API dependencies installed
) else (
    echo ⚠️  API dependencies not installed - run 'npm install' in api folder
)

REM Test 6: Vercel configuration
cd ..
if exist "vercel.json" (
    echo ✅ vercel.json configuration found
) else (
    echo ❌ vercel.json missing
    pause
    exit /b 1
)

echo.
echo 🎉 All deployment tests passed!
echo.
echo 📋 Next steps:
echo 1. Commit your changes: git add . ^&^& git commit -m "Fix deployment issues"
echo 2. Push to GitHub: git push origin main
echo 3. Deploy to Vercel: vercel --prod
echo.
echo 🔗 Test these URLs after deployment:
echo - https://your-app.vercel.app/
echo - https://your-app.vercel.app/login
echo - https://your-app.vercel.app/api/auth/me
echo.
pause
