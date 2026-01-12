# Atmosphere Core Audit Portal

A web application for managing website change requests with file uploads and analytics tracking.

## Features

- Submit website change requests with priority levels
- Upload files (images, PDFs, documents) using Vercel Blob Storage
- View and search submitted requests
- Export data to CSV
- Analytics dashboard for page views
- PostgreSQL database for persistent storage

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Vercel Serverless Functions
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd atmosphere-core-audit-portal
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Vercel Blob Storage (get from Vercel Dashboard > Storage > Blob)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Optional: Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Database Setup

Run the database migration:

```bash
pnpm drizzle-kit push
```

### 4. Development

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 5. Deploy to Vercel

```bash
vercel
```

Make sure to set the environment variables in the Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`

## API Endpoints

- `GET /api/requests` - Fetch all change requests
- `POST /api/requests` - Submit a new change request
- `DELETE /api/requests` - Clear all requests
- `GET /api/analytics` - Get page view statistics
- `POST /api/analytics` - Increment page view count
- `POST /api/upload` - Handle file uploads (used internally)

## Key Fixes Applied

### 1. Vercel Configuration
Added `vercel.json` to properly route API requests to serverless functions.

### 2. Development Proxy
Updated `vite.config.ts` to proxy `/api` requests during local development.

### 3. API Handler Format
Ensured all API handlers follow Vercel's serverless function format with proper exports.

### 4. Build Configuration
Added `vercel-build` script for production builds.

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── requests.ts        # CRUD operations for requests
│   ├── upload.ts          # File upload handler
│   └── analytics.ts       # Analytics tracking
├── components/            # React components
│   ├── Dashboard.tsx      # Analytics dashboard
│   ├── Layout.tsx         # App layout wrapper
│   ├── ReportForm.tsx     # Change request form
│   └── SubmissionList.tsx # List of submissions
├── db/                    # Database configuration
│   ├── index.ts           # Drizzle setup
│   └── schema.ts          # Database schema
├── services/              # Business logic
│   └── storageService.ts  # API client service
├── App.tsx                # Main app component
├── types.ts               # TypeScript types
├── vercel.json            # Vercel configuration
└── vite.config.ts         # Vite configuration
```

## Troubleshooting

### API requests fail in development
Make sure the Vite dev server is running. The proxy configuration should handle `/api` routes automatically.

### API requests fail on Vercel
1. Verify environment variables are set in Vercel dashboard
2. Check that `vercel.json` exists in the root directory
3. Ensure the database is accessible from Vercel's network

### File uploads fail
1. Verify `BLOB_READ_WRITE_TOKEN` is set correctly
2. Check that the token has read/write permissions
3. Make sure the file size is within limits

## License

MIT
