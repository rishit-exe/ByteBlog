-- Fix RLS policies for engagement tables
-- Run this in your Supabase SQL editor if you're having issues with likes/bookmarks

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

DROP POLICY IF EXISTS "Anyone can read bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Authenticated users can create bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;

-- Create permissive policies for likes
CREATE POLICY "Anyone can read likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create likes" ON likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete likes" ON likes
  FOR DELETE USING (true);

-- Create permissive policies for bookmarks
CREATE POLICY "Anyone can read bookmarks" ON bookmarks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete bookmarks" ON bookmarks
  FOR DELETE USING (true);

-- Confirmation message
SELECT 'RLS policies fixed for engagement tables!' as status;
