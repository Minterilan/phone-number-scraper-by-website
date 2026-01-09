# 🚀 Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: Via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   cd company-scraper-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"
   - Done! Your app is live 🎉

### Method 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd company-scraper-app
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: company-scraper-app (or your choice)
   - Directory: ./
   - Auto-detected settings: Yes

5. **Production deployment**
   ```bash
   vercel --prod
   ```

## Environment Variables (Optional)

Currently no environment variables are needed. If you want to add custom configurations in the future:

1. In Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add your variables

2. Via CLI:
   ```bash
   vercel env add VARIABLE_NAME
   ```

## Custom Domain

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for propagation (usually instant)

## Monitoring & Logs

- View deployment logs in Vercel Dashboard
- Real-time function logs available
- Analytics enabled by default

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### API Routes Timing Out

- Increase function timeout in `vercel.json`
- Maximum timeout on free plan: 10 seconds
- Pro plan: up to 60 seconds

### CORS Issues

CORS is handled automatically by Next.js API routes. If you face issues:
- Check your API route configuration
- Verify the request origin

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] README updated with live URL
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] Share with friends! 🎉

## Post-Deployment

Your app will be available at:
- `https://your-project.vercel.app`
- Or your custom domain

Share it with your friends!

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/YOUR_USERNAME/YOUR_REPO/issues

---

Good luck with your deployment! 🚀
