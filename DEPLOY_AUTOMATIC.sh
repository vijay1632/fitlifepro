#!/bin/bash

echo "🚀 FitLife Pro - Automatic Deployment Helper"
echo "==========================================="
echo ""
echo "⚠️  Due to sandbox restrictions, some steps need manual confirmation"
echo ""
echo "This script will guide you through automated deployment to Vercel"
echo ""
echo "Prerequisites you need ready:"
echo "1. GitHub account"
echo "2. Vercel account"
echo "3. Supabase account (for free database)"
echo ""
read -p "Do you have all three accounts? (y/n): " has_accounts

if [[ "$has_accounts" != "y" && "$has_accounts" != "Y" ]]; then
    echo ""
    echo "Please create accounts first:"
    echo "- GitHub: https://github.com/join"
    echo "- Vercel: https://vercel.com/signup"
    echo "- Supabase: https://supabase.com/signup"
    exit 1
fi

echo ""
echo "Starting automated deployment process..."
echo ""

# Step 1: Git setup
echo ""
echo "Step 1/5: Setting up GitHub repository"
echo "----------------------------------------"
read -p "Enter your GitHub username: " github_username

# Configure git
git config --global user.name "$github_username"
git config --global user.email "${github_username}@users.noreply.github.com"

# Initialize repo if not exists
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: FitLife Pro Fitness Application"
fi

# Create remote
remote_url="https://github.com/${github_username}/fitlifepro.git"
if ! git remote | grep -q origin; then
    git remote add origin "$remote_url"
    echo "Added remote: $remote_url"
else
    git remote set-url origin "$remote_url"
    echo "Updated remote: $remote_url"
fi

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Step 1 Complete: Code pushed to GitHub"
echo ""

# Step 2: Vercel deployment instructions
echo ""
echo "Step 2/5: Vercel deployment"
echo "-----------------------------"
echo "Please follow these steps manually:"
echo "1. Go to: https://vercel.com"
echo "2. Sign in with GitHub (click 'Continue with GitHub')"
echo "3. Click 'Add New Project'"
echo "4. Search for: fitlifepro"
echo "5. Click 'Import'"
echo "6. Click 'Deploy'"
echo ""
read -p "Have you deployed on Vercel? (y/n): " vercel_deployed

if [[ "$vercel_deployed" != "y" && "$vercel_deployed" != "Y" ]]; then
    echo ""
    echo "⚠️  Please complete Vercel deployment first, then re-run this script"
    echo "    You can pause here, deploy on Vercel, then continue"
    exit 0
fi

echo ""
echo "✅ Step 2 Complete: Application deployed to Vercel"
echo ""

# Step 3: Supabase setup
echo ""
echo "Step 3/5: Supabase database setup"
echo "----------------------------------"
echo "Please follow these steps manually:"
echo "1. Go to: https://supabase.com"
echo "2. Sign in (or create account)"
echo "3. Click 'New Project'"
echo "4. Name: fitlifepro"
echo "5. Set database password (remember it!)"
echo "6. Wait for project to be ready"
echo "7. Go to Settings → Database → Connection string"
echo "8. Copy the connection string"
echo ""
read -p "Have you copied the Supabase connection string? (y/n): " supabase_ready

if [[ "$supabase_ready" != "y" && "$supabase_ready" != "Y" ]]; then
    echo ""
    echo "⚠️  Please get your Supabase connection string first"
    exit 0
fi

read -p "Paste your Supabase connection string: " database_url

# Save to .env
echo "DATABASE_URL=$database_url" >> .env
echo ""
echo "✅ Step 3 Complete: Database configured"
echo ""

# Step 4: Generate auth secret
echo ""
echo "Step 4/5: Generating authentication secret"
echo "------------------------------------------"
auth_secret=$(openssl rand -base64 32)
echo "AUTH_SECRET=$auth_secret" >> .env
echo "NEXTAUTH_SECRET=$auth_secret" >> .env
echo ""
echo "✅ Step 4 Complete: Auth secrets generated"
echo ""

# Step 5: Final instructions
echo ""
echo "Step 5/5: Final configuration"
echo "------------------------------"
echo ""
echo "You need to add these environment variables to your Vercel project:"
echo ""
echo "1. Go to: https://vercel.com/${github_username}/fitlifepro/settings/environment-variables"
echo "2. Add these variables:"
echo ""
echo "   Name: DATABASE_URL"
echo "   Value: $database_url"
echo ""
echo "   Name: AUTH_SECRET"
echo "   Value: $auth_secret"
echo ""
echo "   Name: NEXTAUTH_SECRET"
echo "   Value: $auth_secret"
echo ""
echo "3. Click 'Save' for each"
echo ""
echo "4. Vercel will automatically redeploy"
echo ""
echo "5. Your app will be live at:"
echo "   https://fitlifepro.vercel.app"
echo ""
echo ""
echo "🎉 AUTOMATIC DEPLOYMENT HELPER COMPLETE!"
echo ""
echo "📝 Login Credentials:"
echo "   Admin: admin@fitlifepro.com / admin123"
echo "   Trainer: trainer@fitlifepro.com / trainer123"
echo "   Member: amit@example.com / member123"
echo ""
echo "📚 Documentation:"
echo "   - For troubleshooting: check FIX_ISSUE.md"
echo "   - For more details: check FREE_DEPLOYMENT.md"
echo ""