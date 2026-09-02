# Quick Start Guide - FitLife Pro

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ database

## Installation Steps

### 1. Install Dependencies

```bash
# First, fix npm permissions if needed
sudo chown -R $USER ~/.npm

# Then install
npm install
```

### 2. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

Required in `.env`:
```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/fitness_app"
AUTH_SECRET="your-super-secret-key-at-least-32-characters"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

### Admin
- Email: `admin@fitlifepro.com`
- Password: `admin123`

### Trainer
- Email: `trainer@fitlifepro.com`
- Password: `trainer123`

### Members
- `amit@example.com` / `member123`
- `priya@example.com` / `member123`
- `vikram@example.com` / `member123`

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code
npm run type-check       # TypeScript check

# Production
npm run build            # Build for production
npm start                # Start production server
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
```

## What's Next?

### 1. Review Database Schema
Check `prisma/schema.prisma` for all available models

### 2. Explore i18n Translations
Check `messages/en.json` for available translations

### 3. Add Your Own Data
```typescript
// Example: Add new exercise
await prisma.exercise.create({
  data: {
    name: 'Your Exercise',
    muscleGroup: 'CHEST',
    difficulty: 'INTERMEDIATE',
    equipment: 'BARBELL',
    // ... other fields
  }
});
```

### 4. Start Building Features

Check `IMPLEMENTATION.md` for detailed roadmap

## Troubleshooting

**Database connection error:**
```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL if needed
brew services restart postgresql  # macOS
sudo systemctl restart postgresql  # Linux
```

**npm permission error:**
```bash
# Fix npm cache permissions
sudo chown -R $USER ~/.npm
```

**Prisma sync error:**
```bash
# Reset and recreate migrations
npm run prisma migrate reset
npm run prisma:seed
```

## Help

- Read `README.md` for detailed documentation
- Check `IMPLEMENTATION.md` for implementation roadmap
- See `PROJECT_SUMMARY.md` for what's been built

---

**Ready to build your fitness platform!** 🚀