# Environment Setup for ByteBlog

## Issue: Sign Out Redirecting to localhost:3000

Your app is running on `10.3.154.94:8098` but sign out is redirecting to `localhost:3000`. This is because NextAuth needs proper environment variables.

## Solution: Create .env.local file

Create a `.env.local` file in your project root with the following content:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://10.3.154.94:8098
NEXTAUTH_SECRET=your-secret-key-here

# Supabase Configuration (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Steps to Fix:

1. **Create `.env.local` file** in your project root
2. **Add the environment variables** above
3. **Replace the values** with your actual Supabase credentials
4. **Restart your development server** (`npm run dev`)

## For Production:

When you deploy to production, make sure to set these environment variables in your hosting platform:

- `NEXTAUTH_URL` should be your production domain (e.g., `https://yourdomain.com`)
- `NEXTAUTH_SECRET` should be a secure random string
- Supabase variables should be your production Supabase project values

## Why This Happens:

NextAuth uses the `NEXTAUTH_URL` environment variable to determine where to redirect after sign out. If this isn't set, it defaults to `localhost:3000`.
