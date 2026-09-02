# FitLife Pro - Modern Fitness & Open Gym Management Platform

A complete, production-ready fitness management and personal fitness tracking web application built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Complete Fitness Management
- **Gym Members** - Full profile management, membership tracking, attendance
- **Trainers** - Client management, workout planning, progress tracking
- **Admin Dashboard** - Comprehensive gym analytics, member management, reports

### Personal Fitness Tracking
- **Workout System** - Exercise library, workout plans, workout logging, personal records
- **Nutrition Tracking** - Daily food logging, nutrition goals, water tracking
- **AI Food Analysis** - Upload food photos for AI-powered nutrition estimation
- **Progress Tracking** - Weight tracking, body measurements, progress photos

### Premium Features
- **Multi-language Support** - English, Hindi, Marathi
- **Responsive Design** - Mobile-first, tablet, and desktop
- **Role-based Access** - Admin, Trainer, Member roles with proper permissions
- **Advanced Analytics** - Charts, reports, progress tracking
- **Notifications** - Workouts, membership alerts, milestones
- **Modern UI** - Built with shadcn/ui, Tailwind CSS, Lucide icons

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Server Components
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **i18n**: next-intl
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /Users/apple/Documents/deepseek
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_app?schema=public"

# NextAuth
AUTH_SECRET="your-super-secret-key-change-this-in-production"

# AI (for food photo analysis)
OPENAI_API_KEY="your-openai-api-key"

# App Configuration
NEXT_PUBLIC_APP_NAME="FitLife Pro"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Credentials

### Admin
- Email: `admin@fitlifepro.com`
- Password: `admin123`

### Trainer
- Email: `trainer@fitlifepro.com`
- Password: `trainer123`

### Members
- Email: `amit@example.com`
- Password: `member123`

- Email: `priya@example.com`
- Password: `member123`

- Email: `vikram@example.com`
- Password: `member123`

## 📁 Project Structure

```
fitness-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── dashboard/                # Member/Trainer dashboards
│   ├── admin/                    # Admin dashboard
│   ├── workout/                  # Workout pages
│   ├── nutrition/                # Nutrition pages
│   ├── progress/                 # Progress pages
│   ├── membership/               # Membership pages
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard components
│   ├── workout/                  # Workout components
│   ├── nutrition/                # Nutrition components
│   └── progress/                 # Progress components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   ├── permissions.ts            # Role-based permissions
│   └── validation.ts             # Validation schemas
├── prisma/                       # Database schema
│   ├── schema.prisma             # Prisma schema
│   └── seed.ts                   # Seed data
├── messages/                     # i18n translations
│   ├── en.json                   # English
│   ├── hi.json                   # Hindi
│   └── mr.json                   # Marathi
└── public/                       # Static assets
```

## 🗄️ Database Schema

The application includes comprehensive database models:

- **Users**: Authentication and user profiles
- **Roles**: Admin, Trainer, Member
- **Membership Plans**: Basic, Standard, Premium
- **Memberships**: Active, expiring, expired
- **Exercises**: Full exercise library
- **Workouts**: Workout plans and exercises
- **Food Database**: Nutrition information for foods
- **Food Logs**: Daily food tracking
- **Attendance**: Check-in/out tracking
- **Measurements**: Weight and body measurements
- **Progress Photos**: Before/after photos
- **Personal Records**: Best performances
- **Payments**: Transaction history
- **Notifications**: User notifications

## 🎨 Customization

### Adding Exercises

Edit `prisma/schema.prisma` in the `Exercise` model and seed data in `prisma/seed.ts`.

### Adding Foods

Edit `prisma/schema.prisma` in the `FoodItem` model and seed data in `prisma/seed.ts`.

### Adding Translations

Edit files in `messages/` folder:
- `messages/en.json` - English
- `messages/hi.json` - Hindi
- `messages/mr.json` - Marathi

### Changing Theme Colors

Edit `tailwind.config.ts` in the `theme.extend.colors` section.

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Environment-based configuration
- No hardcoded secrets

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key (for AI food analysis) | Optional |
| `SMTP_HOST` | SMTP server for emails | Optional |
| `SMTP_USER` | SMTP username | Optional |
| `SMTP_PASSWORD` | SMTP password | Optional |

## 📱 Features by Role

### Member
- Dashboard with daily progress
- Workout logging
- Nutrition tracking
- Weight progress
- Progress photos
- Attendance tracking
- Membership management

### Trainer
- Client management
- Workout assignment
- Progress monitoring
- Nutritional guidance
- Attendance tracking
- Reports generation

### Admin
- Member management
- Trainer management
- Membership plans
- Financial reports
- Attendance reports
- System settings
- User management

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@fitlifepro.com

## 🙏 Acknowledgments

- Next.js team
- Prisma team
- shadcn/ui community
- All contributors

---

Built with ❤️ for fitness enthusiasts worldwide.

**FitLife Pro** - Making fitness accessible, trackable, and achievable.