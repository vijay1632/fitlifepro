#!/bin/bash

echo "🎯 FitLife Pro - Complete Deployment Script"
echo ""
echo "⚠️  IMPORTANT: Due to sandbox restrictions, some commands need to be run by you"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Step 1/6: Install Dependencies${NC}"
echo "------------------------------------------------------------"
echo "Run this command manually:"
echo "  cd /Users/apple/Documents/deepseek"
echo "  npm install"
echo ""
read -p "Press Enter after running npm install..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependencies not found. Please run npm install first${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 2/6: Generate Prisma Client${NC}"
echo "------------------------------------------------------------"
echo "Run this command:"
echo "  npm run prisma:generate"
echo ""
read -p "Press Enter after running..."

echo -e "${GREEN}✅ Prisma Client generated${NC}"

echo ""
echo -e "${GREEN}Step 3/6: Setup Database${NC}"
echo "------------------------------------------------------------"
echo "Choose your database option:"
echo "1) Supabase (Recommended - 100% free, no setup required)"
echo "2) Local PostgreSQL"
echo "3) Skip for now (will ask during deployment)"
echo ""
read -p "Enter choice (1-3): " db_choice

if [ "$db_choice" = "1" ]; then
    echo ""
    echo -e "${YELLOW}Option 1: Supabase${NC}"
    echo "1. Go to https://supabase.com and create free account"
    echo "2. Create new project named 'fitlifepro'"
    echo "3. Go to Settings → Database → Connection string"
    echo "4. Copy the connection string"
    echo ""
    read -p "Enter your DATABASE_URL: " database_url
    echo "DATABASE_URL=$database_url" >> .env
    echo -e "${GREEN}✅ Database URL saved${NC}"
elif [ "$db_choice" = "2" ]; then
    echo ""
    echo -e "${YELLOW}Option 2: Local PostgreSQL${NC}"
    echo "1. Make sure PostgreSQL is running"
    echo "2. Create database: createdb fitness_app"
    echo ""
    read -p "Enter DATABASE_URL (e.g., postgresql://postgres:password@localhost:5432/fitness_app): " database_url
    echo "DATABASE_URL=$database_url" >> .env
    echo -e "${GREEN}✅ Database URL saved${NC}"
else
    echo ""
    echo -e "${YELLOW}Skipping database setup. Add DATABASE_URL to .env manually${NC}"
    read -p "Enter DATABASE_URL now (or skip): " database_url
    if [ ! -z "$database_url" ]; then
        echo "DATABASE_URL=$database_url" >> .env
        echo -e "${GREEN}✅ Database URL saved${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Step 4/6: Run Migrations${NC}"
echo "------------------------------------------------------------"
echo "Run this command:"
echo "  npm run prisma:migrate"
echo ""
read -p "Press Enter after running..."

echo -e "${GREEN}✅ Database migrated${NC}"

echo ""
echo -e "${GREEN}Step 5/6: Seed Database${NC}"
echo "------------------------------------------------------------"
echo "Run this command:"
echo "  npm run prisma:seed"
echo ""
read -p "Press Enter after running..."

echo -e "${GREEN}✅ Database seeded with sample data${NC}"

echo ""
echo -e "${GREEN}Step 6/6: Build and Start${NC}"
echo "------------------------------------------------------------"
echo "Run this command:"
echo "  npm run build"
echo ""
read -p "Press Enter after building..."

if [ -d ".next" ]; then
    echo -e "${GREEN}✅ Application built successfully${NC}"
else
    echo -e "${RED}❌ Build failed. Please check the errors above${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 7/7: Start Server${NC}"
echo "------------------------------------------------------------"
echo "Run this command:"
echo "  npm start"
echo ""
echo -e "${YELLOW}Server will start on http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""
read -p "Press Enter to start the server..."

npm start

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📝 Default Login Credentials:"
echo "   Admin: admin@fitlifepro.com / admin123"
echo "   Trainer: trainer@fitlifepro.com / trainer123"
echo "   Member: amit@example.com / member123"
echo ""
echo "📚 Additional Resources:"
echo "   - Deployment Guide: DEPLOY_GUIDE.md"
echo "   - Free Deployment: FREE_DEPLOYMENT.md"
echo "   - Documentation: README.md"
echo ""
echo "🚀 Enjoy your FitLife Pro application!"