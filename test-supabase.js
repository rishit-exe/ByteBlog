const { createClient } = require('@supabase/supabase-js');

// Read .env file manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testPosts() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', envVars.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author, user_id, category, tags, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error:", error);
    return;
  }

  console.log('✅ Successfully fetched posts:', data?.length || 0);
  console.log('📝 Posts data:', data?.map(p => ({ 
    id: p.id, 
    title: p.title, 
    author: p.author,
    user_id: p.user_id,
    category: p.category,
    tags: p.tags
  })));
}

testPosts();
