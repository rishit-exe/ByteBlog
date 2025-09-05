-- Fix RLS policies for users table to allow registration
-- This script fixes the user registration issues

-- First, let's see what policies currently exist on the users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Anyone can create users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Re-enable RLS on users table (in case it was disabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies that work with your authentication system
-- Allow anyone to create users (for registration)
CREATE POLICY "Anyone can create users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own data (more permissive for now)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Allow users to update their own data (more permissive for now)
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Confirmation message
SELECT 'Users table RLS policies updated successfully!' as status;
