#!/bin/bash

echo "🚀 Deploying FitLife Pro Fitness Application"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
if ! psql -U postgres -c "\l" | grep -q fitness_app; then
  psql -U postgres -c "CREATE DATABASE fitness_app;"
fi

# Run migrations
echo "📊 Running database migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

# Build the application
echo "🔨 Building application..."
npm run build

# Start production server
echo "✅ Starting production server..."
npm start

echo "🎉 Application deployed successfully!"
echo "📱 Open http://localhost:3000 in your browser"
echo ""
echo "📝 Default Login Credentials:"
echo "   Admin: admin@fitlifepro.com / admin123"
echo "   Trainer: trainer@fitlifepro.com / trainer123"
echo "   Member: amit@example.com / member123"