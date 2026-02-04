# 💰 Expense Tracker - Vercel Deployment Guide

A comprehensive expense tracking application with Philippine bank support, installment tracking, and full accounting features.

## Features

✅ Gmail-based authentication
✅ Income, expense, and savings tracking
✅ Philippine bank credit card support (UnionBank, BDO, BPI, RCBC, EastWest, etc.)
✅ Installment payment tracking (2-36 months)
✅ Assets, Liabilities, and Equity calculations
✅ Monthly summaries and filtering
✅ Debt payable calculations
✅ Multiple payment methods (Cash, Debit, Credit)
✅ Data persists in browser localStorage

## Deploy to Vercel (Easiest Method)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it `expense-tracker` (or any name you prefer)
3. Don't initialize with README

4. Upload all the files from this folder to your GitHub repository:
   - You can use GitHub's web interface to upload files
   - Or use git commands (see below)

### Using Git Commands (Optional):

```bash
cd expense-tracker-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/expense-tracker.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your `expense-tracker` repository
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"
7. Wait 1-2 minutes for deployment to complete
8. Your app will be live at `https://your-project-name.vercel.app`

### Step 3: Add Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `myexpensetracker.com`)
4. Follow Vercel's instructions to update your DNS settings
5. Your app will be available at your custom domain!

## Alternative: Deploy Without GitHub

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to the project folder:
```bash
cd expense-tracker-deploy
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and your site will be live!

## Local Development

If you want to test locally first:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Use the App

1. **Login**: Enter your Gmail address to create/access your account
2. **Add Transactions**: Use the form to add income, expenses, or savings
3. **Credit Cards**: For credit card expenses, select your Philippine bank
4. **Installments**: Enable installment payments for purchases (automatically splits across months)
5. **Monthly View**: Select different months to view transaction history
6. **Categories**: Track expenses by category
7. **Assets/Liabilities**: Mark transactions as assets or liabilities for accounting

## Data Storage

- Data is stored in your browser's localStorage
- Each Gmail account has separate data
- Data persists across sessions
- Clear browser data will erase your transactions
- For true cloud storage, consider upgrading to Firebase (contact developer)

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - feel free to modify and use!
