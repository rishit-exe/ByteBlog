"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogIn, LogOut, PenTool } from "lucide-react";

export default function AuthNavigation() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="fixed top-0 right-0 p-4 z-50">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="animate-pulse w-20 h-6 bg-gray-300/20 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 right-0 p-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-4">
        {session ? (
          <>
            <div className="flex items-center gap-2 text-white">
              <User size={18} />
              <span className="text-sm">{session.user.name}</span>
            </div>
            
            <Link 
              href="/new" 
              className="flex items-center gap-1 text-white hover:text-blue-300 transition-colors"
              title="Create new post"
            >
              <PenTool size={18} />
              <span className="text-sm">New Post</span>
            </Link>
            
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-white hover:text-red-300 transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
              <span className="text-sm">Sign Out</span>
            </button>
          </>
        ) : (
          <Link 
            href="/auth/signin"
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <LogIn size={18} />
            <span className="text-sm">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}