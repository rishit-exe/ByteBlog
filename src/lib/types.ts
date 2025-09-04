export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author?: string;
  user_id?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}