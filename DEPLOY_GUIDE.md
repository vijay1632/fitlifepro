# 🚀 FitLife Pro - Installation & Deployment Guide

## Important: npm Installation Issue

Due to sandbox restrictions, I cannot directly install npm packages. You need to run these commands yourself.

---

## Step 1: Install Dependencies (You Need to Run This)

```bash
cd /Users/apple/Documents/deepseek

# Install npm dependencies
npm install --ignore-scripts

# After installation, manually install dependencies
cd node_modules/react
npm install
cd ../react-dom
npm install

# Go back to root
cd /Users/apple/Documents/deepseek

# Now you can proceed
```

**OR** simply run:
```bash
cd /Users/apple/Documents/deepseek
npm install
```

---

## Step 2: Setup Database (You Need to Run This)

### Option A: Supabase (Recommended - Free)

1. Create free account at https://supabase.com
2. Create new project named `fitlifepro`
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:YOUR_PASSWORD@db.abcdefghijklmnopqrstuvwxyz.supabase.co:5432/postgres`

### Option B: Local PostgreSQL

1. Start PostgreSQL:
   ```bash
   # macOS
   brew services start postgresql@14

   # Linux
   sudo systemctl start postgresql
   ```

2. Create database:
   ```bash
   createdb fitness_app
   ```

3. Configure connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@localhost:5432/fitness_app
   ```

---

## Step 3: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

---

## Step 4: Build the Application

```bash
# Build for production
npm run build
```

---

## Step 5: Start the Server

```bash
# Start production server
npm start
```

---

## Step 6: Access Your Application

Open your browser and go to:
```
http://localhost:3000
```

---

## Quick Deployment Guide for Free Hosting

### Deploy on Vercel (Recommended - 100% Free)

#### 1. Push to GitHub
```bash
cd /Users/apple/Documents/deepseek
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fitlifepro.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Sign up (use GitHub)
3. Click "Add New Project"
4. Select `fitlifepro` repository
5. Click "Deploy"
6. Wait 2-3 minutes

#### 3. Create Free Database (Supabase)
1. Go to https://supabase.com
2. Create free account
3. Create new project named `fitlifepro`
4. Get connection string
5. Add to Vercel → Environment Variables:
   - `DATABASE_URL`: Your connection string
   - `AUTH_SECRET`: Random 32+ character string
   - `NEXTAUTH_SECRET`: Same as AUTH_SECRET

#### 4. Your App is Live!
URL: `https://fitlifepro.vercel.app`

---

## Development Mode (Local Testing)

```bash
cd /Users/apple/Documents/deepseek

# Install dependencies
npm install

# Start development server
npm run dev
```

Open: http://localhost:3000

---

## Default Login Credentials

### Admin
- Email: admin@fitlifepro.com
- Password: admin123

### Trainer
- Email: trainer@fitlifepro.com
- Password: trainer123

### Members
- Email: amit@example.com
- Password: member123

- Email: priya@example.com
- Password: member123

- Email: vikram@example.com
- Password: member123

---

## Troubleshooting

### Problem: "next: command not found"
```bash
npm install
```

### Problem: Database connection error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env file
- Ensure database exists

### Problem: Build fails
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Problem: Permission denied
```bash
sudo chown -R $USER:staff /Users/apple/Documents/deepseek
```

---

## Alternative: Docker Deployment

```bash
# Build image
docker build -t fitlifepro .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e AUTH_SECRET="your-secret" \
  -e NEXTAUTH_SECRET="your-secret" \
  fitlifepro
```

---

## Free Database Options

### 1. Supabase (Recommended)
- Website: https://supabase.com
- Free tier: 500MB database
- SSL support
- Real-time features

### 2. Railway
- Website: https://railway.app
- Free tier: $5 credit/month
- Easy setup

### 3. Render
- Website: https://render.com
- Free tier: 750 hours/month
- Built-in database

---

## Files Created for You

✅ Complete application code (60+ files)
✅ Database schema (40+ models)
✅ Seed data (users, exercises, foods, workouts)
✅ UI components (15+ components)
✅ All pages (login, register, dashboard, etc.)
✅ Documentation (README, DEPLOYMENT, etc.)
✅ Deployment guides (FREE_DEPLOYMENT.md, etc.)

---

## Checklist

- [ ] Install npm dependencies: `npm install`
- [ ] Setup PostgreSQL database (Supabase or local)
- [ ] Generate Prisma Client: `npm run prisma:generate`
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Seed database: `npm run prisma:seed`
- [ ] Build application: `npm run build`
- [ ] Start server: `npm start`
- [ ] Access at: http://localhost:3000
- [ ] Login with provided credentials
- [ ] Test all features

---

## Next Steps After Local Testing

1. **Push to GitHub** for Vercel deployment
2. **Create free database** (Supabase)
3. **Configure environment variables** in Vercel
4. **Deploy to Vercel** (automatic from GitHub)
5. **Enjoy your free hosting!**

---

## Support

If you encounter issues:
1. Check the deployment guides in `FREE_DEPLOYMENT.md`
2. Check `DEPLOYMENT.md` for detailed instructions
3. Check `FREE_DEPLOYMENT_SUMMARY.md` for quick reference

---

**Status**: Ready to install and deploy! ✅
**Estimated Time**: 15-20 minutes
**Cost**: $0 for local + free hosting

Let me know if you need help with any specific step! 🚀