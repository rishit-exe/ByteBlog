"use client";

import { 
  PenTool, 
  Users, 
  Heart, 
  Bookmark, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  Code, 
  Palette,
  Database,
  Rocket
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AboutClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    {
      icon: <PenTool className="w-8 h-8 text-blue-400" />,
      title: "Rich Markdown Editor",
      description: "Write beautiful posts with our advanced markdown editor featuring live preview, syntax highlighting, and split-view editing.",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "User Authentication",
      description: "Secure user accounts with NextAuth.js. Create, manage, and personalize your blogging experience.",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-400" />,
      title: "Engagement Features",
      description: "Like and bookmark posts to show appreciation and save your favorite content for later reading.",
      gradient: "from-red-500/20 to-pink-500/20"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Built with Next.js 15 and optimized for performance. Experience blazing-fast page loads and smooth interactions.",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Secure & Reliable",
      description: "Powered by Supabase with Row Level Security. Your data is protected with enterprise-grade security.",
      gradient: "from-purple-500/20 to-violet-500/20"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-400" />,
      title: "Mobile Responsive",
      description: "Perfect experience on any device. Our responsive design adapts beautifully to phones, tablets, and desktops.",
      gradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  const benefits = [
    {
      icon: <Code className="w-6 h-6 text-blue-300" />,
      title: "Modern Tech Stack",
      description: "Next.js 15, React 19, TypeScript, Tailwind CSS"
    },
    {
      icon: <Database className="w-6 h-6 text-green-300" />,
      title: "Real-time Database",
      description: "Supabase PostgreSQL with instant updates"
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-300" />,
      title: "Beautiful UI",
      description: "Glassmorphism design with smooth animations"
    },
    {
      icon: <Rocket className="w-6 h-6 text-orange-300" />,
      title: "Deployment Ready",
      description: "Optimized for Vercel with environment configuration"
    }
  ];

  const handleGetStartedClick = () => {
    if (session?.user) {
      // User is logged in, redirect to create new post
      router.push("/new");
    } else {
      // User is not logged in, redirect to signup
      router.push("/auth/signup");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 text-white">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to ByteBlog
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          A modern, feature-rich blogging platform built for developers, writers, and content creators. 
          Share your thoughts, connect with readers, and build your digital presence with style.
        </p>
      </div>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-400">ByteBlog</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:border-white/20 transition-all duration-300 group hover:scale-105`}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Built with <span className="text-green-400">Modern Technology</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                {benefit.icon}
                <h3 className="font-semibold text-white">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-gray-300">Open Source</div>
          </div>
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-400 mb-2">⚡</div>
            <div className="text-gray-300">Lightning Fast</div>
          </div>
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-400 mb-2">🔒</div>
            <div className="text-gray-300">Secure</div>
          </div>
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-pink-400 mb-2">📱</div>
            <div className="text-gray-300">Responsive</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join ByteBlog today and experience the future of blogging. Create, share, and connect with a platform designed for modern content creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStartedClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              {session?.user ? "Create New Post" : "Get Started Free"}
            </button>
            <a 
              href="/" 
              className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Explore Posts
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
