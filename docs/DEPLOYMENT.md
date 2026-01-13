# Deployment Guide

## Issues Found and Fixed

### 1. **Missing Vercel Configuration**
**Problem**: Vercel didn't know how to route `/api/*` requests to the serverless functions in the `api/` directory.

**Solution**: Created `vercel.json` with proper routing configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### 2. **Development Server Missing API Proxy**
**Problem**: During local development, Vite didn't know how to handle `/api` requests.

**Solution**: Added proxy configuration in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path,
    },
  },
}
```

### 3. **Missing Build Script**
**Problem**: Vercel didn't have a specific build command configured.

**Solution**: Added `vercel-build` script to `package.json`.

## Deployment Steps

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

1. **DATABASE_URL** (Required)
   - Your PostgreSQL connection string
   - Format: `postgresql://user:password@host:5432/database`
   - Get from your database provider (Vercel Postgres, Neon, Supabase, etc.)

2. **BLOB_READ_WRITE_TOKEN** (Required)
   - Your Vercel Blob Storage token
   - Get from: Vercel Dashboard > Storage > Blob > Create Store > Copy Token
   - Make sure it has read/write permissions

3. **GEMINI_API_KEY** (Optional)
   - Only if using Gemini AI features

### Step 2: Deploy

```bash
# Deploy to Vercel
vercel

# Or for production
vercel --prod
```

### Step 3: Run Database Migrations

After first deployment:

```bash
# Install drizzle-kit globally if not already
pnpm add -g drizzle-kit

# Run migrations on your production database
# Make sure DATABASE_URL points to your production database
pnpm drizzle-kit push
```

## Testing the Deployment

### 1. Test API Endpoints

```bash
# Check if requests endpoint works
curl https://your-app.vercel.app/api/requests

# Should return an empty array [] on first deployment
```

### 2. Test Form Submission

1. Go to your deployed URL
2. Fill out the change request form
3. Try uploading a file
4. Submit the form
5. Check if it appears in the "Submissions" tab

### 3. Test File Upload

1. Make sure you have set `BLOB_READ_WRITE_TOKEN` in Vercel
2. Try uploading different file types (image, PDF, etc.)
3. Files should be stored in Vercel Blob Storage

## Common Issues and Solutions

### Issue: "Failed to save request"
**Cause**: Database connection not configured
**Solution**: 
- Check that `DATABASE_URL` is set in Vercel environment variables
- Verify the database is accessible from Vercel's network
- Run database migrations: `pnpm drizzle-kit push`

### Issue: File uploads fail
**Cause**: Blob storage token not configured
**Solution**: 
- Set `BLOB_READ_WRITE_TOKEN` in Vercel environment variables
- Make sure the token is valid and has correct permissions
- Check Vercel Blob Storage dashboard to verify the store exists

### Issue: API endpoints return 404
**Cause**: Missing or incorrect `vercel.json`
**Solution**: 
- Ensure `vercel.json` exists in the root directory
- Redeploy the application

### Issue: CORS errors
**Cause**: Domain mismatch or proxy misconfiguration
**Solution**: 
- This shouldn't happen as API routes are on the same domain
- If it does, check that `vercel.json` rewrites are correct

## Local Development

```bash
# Install dependencies
pnpm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials
# DATABASE_URL=postgresql://...
# BLOB_READ_WRITE_TOKEN=...

# Run database migrations
pnpm drizzle-kit push

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Verifying Everything Works

1. **Frontend loads**: You should see the change request form
2. **Form submission works**: Fill and submit the form
3. **Files upload**: Attach files and submit
4. **Data persists**: Check the Submissions tab to see your request
5. **Analytics track**: Page view counts should increment
6. **Export works**: Try exporting to CSV from Submissions tab

## Next Steps

1. **Custom Domain**: Add a custom domain in Vercel project settings
2. **Monitoring**: Set up Vercel Analytics and Error Tracking
3. **Database Backups**: Configure automatic backups for your database
4. **Access Control**: Add authentication if needed
5. **Email Notifications**: Consider adding email alerts for new submissions

## Support

If you encounter issues:
1. Check Vercel deployment logs: Vercel Dashboard > Deployments > [Latest] > View Function Logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure database migrations have been run
