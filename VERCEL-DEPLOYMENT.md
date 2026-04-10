# Vercel Deployment Guide

## 🚀 Deploying to Vercel

Your Numy Luxury Real Estate website is now configured for Vercel deployment!

### Prerequisites
- Vercel account connected to your GitHub
- Gmail app password for email functionality

### Steps to Deploy

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will auto-detect the configuration

3. **Configure Environment Variables:**
   In Vercel dashboard → Project Settings → Environment Variables:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CORS_ORIGIN=https://your-project.vercel.app
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX_REQUESTS=3
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Testing Your Deployment

1. **Health Check:**
   ```
   curl https://your-project.vercel.app/api/health
   ```

2. **Contact Form Test:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "message": "Testing Vercel deployment"
     }'
   ```

### Troubleshooting

**Email not working:**
- Verify Gmail app password is correct
- Check Vercel function logs for errors
- Ensure 2FA is enabled on Gmail

**CORS errors:**
- Update `CORS_ORIGIN` in Vercel environment variables
- Include your production domain

**Rate limiting:**
- Reduced to 3 requests per 15 minutes for serverless
- Adjust `RATE_LIMIT_MAX_REQUESTS` if needed

### Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CORS_ORIGIN` environment variable

### Performance Notes

- Vercel automatically handles HTTPS
- Static files are served from CDN
- API routes are serverless functions
- Automatic scaling and global distribution

Your website is now ready for production! 🎉