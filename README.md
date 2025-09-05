## ByteBlog - Modern Blog Platform

🌐 **Live Demo:** [ByteBlog](https://thebyteblog.vercel.app/)

A feature-rich, modern blog platform built with Next.js 15, Supabase, and NextAuth. Features include user authentication, markdown editing, categories, tags, and a beautiful dark theme with **buttery smooth animation scroll** <u>**powered by Lenis integration**</u>.

## Features

- 🔐 **User Authentication** - Sign up, sign in, and secure sessions with NextAuth
- ✍️ **Rich Markdown Editor** - Write posts with live preview and syntax highlighting
- 🏷️ **Categories & Tags** - Organize posts with categories and tags
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🚀 **Modern Stack** - Next.js 15, TypeScript, Tailwind CSS, Supabase
- 🎨 **Dark Theme** - Elegant dark design with particle effects
- 🔍 **Navigation** - Quick navigation and table of contents for posts
- ✨ **Buttery Smooth Scroll** - Enhanced scrolling experience with Lenis integration
- ❤️ **Engagement Features** - Like and bookmark posts with real-time updates

## Getting Started

### Prerequisites

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your Project URL and anon public key

### Database Setup

Run the SQL commands in `database-setup.sql` in your Supabase SQL editor to create the required tables, policies, and indexes for the complete ByteBlog functionality.

### Environment Variables

The `.env` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

Then run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
