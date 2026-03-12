-- Migration: Add SEO fields to blog_posts table
-- Run this SQL in your Supabase SQL Editor

-- Add slug column (URL-friendly identifier)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add description column (SEO meta description)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Update existing posts to have slugs generated from their titles
-- (Only updates posts that don't already have a slug)
UPDATE blog_posts
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), 
        '\s+', 
        '-', 
        'g'
    )
)
WHERE slug IS NULL OR slug = '';

-- Ensure slugs are unique by appending ID if needed
WITH duplicate_slugs AS (
    SELECT slug, COUNT(*) as count
    FROM blog_posts
    GROUP BY slug
    HAVING COUNT(*) > 1
)
UPDATE blog_posts bp
SET slug = bp.slug || '-' || bp.id
FROM duplicate_slugs ds
WHERE bp.slug = ds.slug
  AND bp.id::text NOT IN (
    SELECT MIN(id::text) 
    FROM blog_posts 
    WHERE slug = ds.slug
  );

-- Add NOT NULL constraint to slug after populating existing rows
-- (Uncomment after running the migration once and verifying all posts have slugs)
-- ALTER TABLE blog_posts ALTER COLUMN slug SET NOT NULL;

-- Optional: Add check constraint to ensure slug format
-- Note: Run this only once. If constraint exists, it will error (safe to ignore)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'slug_format_check'
    ) THEN
        ALTER TABLE blog_posts 
        ADD CONSTRAINT slug_format_check 
        CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
    END IF;
END $$;

-- Display results
SELECT id, title, slug, description 
FROM blog_posts 
ORDER BY created_at DESC;
