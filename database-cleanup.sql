-- Database Cleanup Script for ByteBlog
-- Run this in Supabase SQL Editor to remove all custom tables, policies, and functions
-- This script safely handles cases where objects may not exist

-- Drop policies on posts table (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
        DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
        DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
        DROP POLICY IF EXISTS "Users can update own posts" ON posts;
        DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
        DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
    END IF;
END $$;

-- Drop policies on users table (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        DROP POLICY IF EXISTS "Anyone can create users" ON users;
        DROP POLICY IF EXISTS "Users can read own data" ON users;
        DROP POLICY IF EXISTS "Users can update own data" ON users;
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    END IF;
END $$;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Confirmation message
SELECT 'All custom ByteBlog data has been cleaned up successfully!' as status;
