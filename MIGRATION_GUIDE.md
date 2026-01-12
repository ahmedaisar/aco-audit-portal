# Database Migration Guide

## Overview

This guide explains how to apply the database migration for the submission fixes that add support for AHR and COB audit submissions.

## Changes Made

The database schema has been updated to include the following new fields in the `change_requests` table:

1. **tabType** (enum: 'RAS', 'COB', 'AHR') - To distinguish between different submission types
2. **resortName** (text, nullable) - For AHR/COB submissions
3. **resortOpsContact** (text, nullable) - For AHR/COB submissions  
4. **checklistData** (jsonb, nullable) - For AHR/COB audit checklist results
5. **notesData** (jsonb, nullable) - For AHR/COB audit notes

## Migration File

The migration file is located at: `drizzle/0000_bizarre_exiles.sql`

## How to Apply the Migration

### Option 1: Using Drizzle Kit Push (Recommended)

If you have access to the database from your local environment:

```bash
# Make sure you have the DATABASE_URL environment variable set
export DATABASE_URL="postgresql://user:password@host:port/database"

# Install dependencies if not already installed
npm install

# Push the schema changes to the database
npx drizzle-kit push
```

### Option 2: Manual SQL Execution

If you prefer to apply the migration manually or through a database management tool:

1. Connect to your PostgreSQL database
2. Execute the SQL from `drizzle/0000_bizarre_exiles.sql`

**Important Notes:**
- This migration assumes the database is empty or does not have the tables yet
- If you have existing data in the `change_requests` table, you need to modify the migration to use `ALTER TABLE` instead of `CREATE TABLE`

### Option 3: For Existing Data (If tables already exist)

If you already have the tables created and have existing data, use this modified migration:

```sql
-- Add the new enum type for tab_type
CREATE TYPE "public"."tab_type" AS ENUM('RAS', 'COB', 'AHR');

-- Add new columns to existing change_requests table
ALTER TABLE "public"."change_requests" 
  ADD COLUMN "tab_type" "tab_type",
  ADD COLUMN "resort_name" text,
  ADD COLUMN "resort_ops_contact" text,
  ADD COLUMN "checklist_data" jsonb,
  ADD COLUMN "notes_data" jsonb;

-- For existing rows, set tab_type to 'RAS' (or whatever default makes sense)
UPDATE "public"."change_requests" 
SET "tab_type" = 'RAS' 
WHERE "tab_type" IS NULL;

-- Make tab_type NOT NULL after setting defaults
ALTER TABLE "public"."change_requests" 
  ALTER COLUMN "tab_type" SET NOT NULL;
```

## Verification

After applying the migration, verify it was successful:

```sql
-- Check the table structure
\d change_requests

-- Verify the enums were created
SELECT typname FROM pg_type WHERE typname IN ('priority', 'tab_type');

-- Check that you can query the table
SELECT * FROM change_requests LIMIT 1;
```

## Rollback (If Needed)

If you need to rollback the changes:

```sql
-- Remove the new columns
ALTER TABLE "public"."change_requests" 
  DROP COLUMN IF EXISTS "tab_type",
  DROP COLUMN IF EXISTS "resort_name",
  DROP COLUMN IF EXISTS "resort_ops_contact",
  DROP COLUMN IF EXISTS "checklist_data",
  DROP COLUMN IF EXISTS "notes_data";

-- Drop the tab_type enum
DROP TYPE IF EXISTS "public"."tab_type";
```

## Post-Migration

After successfully applying the migration:

1. Restart your application server (if running)
2. Test each submission type:
   - RAS (with file attachments)
   - COB (audit checklist)
   - AHR (audit checklist)
3. Verify submissions appear in the list view
4. Check that all fields are displayed correctly in the detail view

## Troubleshooting

### Error: type "tab_type" already exists
This means the enum was already created. You can skip creating it or drop it first with `DROP TYPE "public"."tab_type";`

### Error: column "tab_type" of relation "change_requests" already exists
The column was already added. You can skip the ALTER TABLE command or check the current schema.

### Error: null value in column "tab_type" violates not-null constraint
Make sure to set default values for existing rows before making the column NOT NULL.

## Support

If you encounter any issues during migration, please:
1. Check the error message carefully
2. Review your current database schema
3. Ensure DATABASE_URL is correctly set
4. Contact the development team if issues persist
