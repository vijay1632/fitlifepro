#!/bin/bash

echo "🔧 Installing npm dependencies..."
npm install

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Generate Prisma Client: npm run prisma:generate"
echo "2. Setup database: npm run prisma:migrate"
echo "3. Seed database: npm run prisma:seed"
echo "4. Build app: npm run build"
echo "5. Start server: npm start"