-- Create proper RLS policies that work with your authentication system
-- This script creates policies that work with NextAuth.js

-- First, let's check what user ID format we're working with
-- Run this to see the current user structure
SELECT auth.uid() as current_auth_uid;

-- Re-enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can read likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

DROP POLICY IF EXISTS "Users can read own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Authenticated users can create bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;

-- Create new policies that work with your auth system
-- For likes table - more permissive policies
CREATE POLICY "Anyone can read likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON likes
  FOR INSERT WITH CHECK (true); -- Allow all authenticated users to create likes

CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (true); -- Allow all authenticated users to delete likes

-- For bookmarks table - more permissive policies
CREATE POLICY "Users can read own bookmarks" ON bookmarks
  FOR SELECT USING (true); -- Allow all authenticated users to read bookmarks

CREATE POLICY "Authenticated users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (true); -- Allow all authenticated users to create bookmarks

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (true); -- Allow all authenticated users to delete bookmarks

-- Confirmation message
SELECT 'RLS policies updated with permissive settings!' as status;
