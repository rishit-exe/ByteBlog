-- Fix RLS policies to allow users to delete their own account
-- This script updates the RLS policies for the users table

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create more permissive policies that allow users to manage their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Add policy to allow users to delete their own account
CREATE POLICY "Users can delete own account" ON users
    FOR DELETE USING (auth.uid() = id);

-- Also ensure the users table has RLS enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a function to handle complete user deletion
CREATE OR REPLACE FUNCTION delete_user_account(user_id_to_delete UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete user's posts
    DELETE FROM posts WHERE user_id = user_id_to_delete;
    
    -- Delete user's likes
    DELETE FROM likes WHERE user_id = user_id_to_delete;
    
    -- Delete user's bookmarks
    DELETE FROM bookmarks WHERE user_id = user_id_to_delete;
    
    -- Delete user's profile
    DELETE FROM users WHERE id = user_id_to_delete;
    
    -- Note: We cannot delete from auth.users here as it requires admin privileges
    -- The user will need to manually delete their auth account or contact support
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
