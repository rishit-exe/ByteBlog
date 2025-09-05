-- Setup engagement tables for ByteBlog
-- Run this in your Supabase SQL editor

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

DROP POLICY IF EXISTS "Anyone can read bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Authenticated users can create bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;

-- Create permissive policies for likes
CREATE POLICY "Anyone can read likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (true);

-- Create permissive policies for bookmarks
CREATE POLICY "Anyone can read bookmarks" ON bookmarks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (true);

-- Confirmation
SELECT 'Engagement tables created successfully!' as status;
