"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, PenTool, LogOut } from "lucide-react";

export default function PillNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ByteBlog Logo */}
        <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-lg font-bold">B</span>
          </div>
          <span className="text-xl font-bold">ByteBlog</span>
        </Link>

        {/* Centered Navigation Pills */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/about")
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            ABOUT
          </Link>
          <Link
            href="/contact"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/contact")
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            CONTACT
          </Link>
          
          {/* Auth Section */}
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 ml-2 border-l border-white/20 pl-4"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <span>{session.user.name}</span>
                <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <Link
                      href="/new"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <PenTool size={16} />
                      New Post
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive("/auth/signin")
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              SIGN IN
            </Link>
          )}
          </div>
        </div>

        {/* Right side spacer to balance layout */}
        <div className="w-32"></div>
      </div>
    </nav>
  );
}