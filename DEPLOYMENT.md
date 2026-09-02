# FitLife Pro - Deployment Guide

## Quick Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Manual Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### 3. Setup Database

```bash
# Create PostgreSQL database
createdb fitness_app

# Generate Prisma Client
npm run prisma:generate

# Create migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### 4. Build Application

```bash
npm run build
```

### 5. Start Server

```bash
npm start
```

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build image
docker build -t fitlifepro .

# Run container
docker run -p 3000:3000 --env-file .env fitlifepro
```

### PM2 (Node.js)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "fitlifepro" -- start

# Save process list
pm2 save

# Setup startup
pm2 startup
```

## Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://username:password@host:5432/fitness_app?schema=public"
AUTH_SECRET="your-super-secret-key-min-32-characters"
NEXTAUTH_SECRET="same-as-auth-secret"
OPENAI_API_KEY="your-openai-api-key"
```

## Database Configuration

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE fitness_app;

-- Connect to database
\c fitness_app;

-- Create schema
CREATE SCHEMA public;
```

### Database Connection String Format

```
postgresql://username:password@host:port/database?schema=public
```

## Database Management

### View Database
```bash
npm run prisma:studio
```

### Reset Database
```bash
npm run prisma:migrate reset
```

### Create New Migration
```bash
npm run prisma migrate dev --name migration_name
```

## Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Logs
```bash
pm2 logs fitlifepro
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build
```

## Security Best Practices

1. **Change default credentials** before production deployment
2. **Use strong AUTH_SECRET** (32+ characters)
3. **Enable HTTPS** in production
4. **Restrict database access** to specific IPs
5. **Enable rate limiting** for API endpoints
6. **Regular backups** of the database
7. **Monitor logs** for suspicious activity

## Performance Optimization

1. **Enable compression**
2. **Use CDN** for static assets
3. **Cache database queries** with Prisma
4. **Implement pagination** for large datasets
5. **Optimize images** before upload

## Backup Strategy

```bash
# Backup database
pg_dump fitness_app > backup_$(date +%Y%m%d).sql

# Restore backup
psql fitness_app < backup_20240101.sql
```

## Scaling

### Horizontal Scaling
```bash
# Multiple instances
pm2 start npm --name "fitlifepro-worker" -- start -- -p 3001
pm2 start npm --name "fitlifepro-worker2" -- start -- -p 3002
```

### Vertical Scaling
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096"
```

---

**Status**: Ready for deployment ✅

**Last Updated**: September 2, 2024