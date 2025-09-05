"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, PenTool, LogOut, Bookmark, Trash2, Menu, X } from "lucide-react";
import DeleteAccountModal from "./DeleteAccountModal";
import { useMobileNav } from "./MobileNavContext";

export default function PillNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Get mobile menu state from context
  const mobileNavContext = useMobileNav();
  const isMobileMenuOpen = mobileNavContext?.isMobileMenuOpen || false;
  const setIsMobileMenuOpen = mobileNavContext?.setIsMobileMenuOpen || (() => {});
  const setIsQuickNavOpen = mobileNavContext?.setIsQuickNavOpen || (() => {});

  const isActive = (path: string) => pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close profile dropdown if clicking outside
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      
      // Close mobile menu if clicking outside the entire nav
      if (!(event.target as Element).closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Show blur effect after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
      isScrolled 
        ? "bg-gradient-to-r from-gray-900/80 via-gray-800/90 to-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 shadow-lg shadow-black/20" 
        : "bg-transparent backdrop-blur-none border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* ByteBlog Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          onClick={() => {
            // Close both mobile menu and quick nav using context
            setIsMobileMenuOpen(false);
            setIsQuickNavOpen(false);
          }}
        >
          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-lg font-bold">B</span>
          </div>
          <span className="text-xl font-bold hidden sm:block">ByteBlog</span>
        </Link>

        {/* Center: Navigation Links - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-white text-black shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/about")
                ? "bg-white text-black shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            ABOUT
          </Link>
          <Link
            href="/contacts"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive("/contacts")
                ? "bg-white text-black shadow-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            CONTACT
          </Link>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            // Close quick nav when opening mobile menu
            if (!isMobileMenuOpen) {
              setIsQuickNavOpen(false);
            }
          }}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Right: User Profile */}
        {session?.user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsMobileMenuOpen(false);
                setIsQuickNavOpen(false);
              }}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <User size={16} />
              <span className="hidden sm:block">{session.user.name}</span>
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
                  <Link
                    href="/saved"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Bookmark size={16} />
                    Saved Posts
                  </Link>
                  <div className="border-t border-white/20 my-1"></div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                  <button
                    onClick={async () => {
                      setIsProfileOpen(false);
                      // Get the current URL and redirect to home page
                      const currentUrl = new URL(window.location.href);
                      const homeUrl = `${currentUrl.protocol}//${currentUrl.host}/`;
                      
                      console.log('Signing out, redirecting to:', homeUrl);
                      
                      await signOut({ 
                        callbackUrl: homeUrl
                      });
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
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <Link
              href="/auth/signin"
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive("/auth/signin")
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuickNavOpen(false);
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg z-40">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuickNavOpen(false);
              }}
            >
              HOME
            </Link>
            <Link
              href="/about"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/about")
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuickNavOpen(false);
              }}
            >
              ABOUT
            </Link>
            <Link
              href="/contacts"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/contacts")
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQuickNavOpen(false);
              }}
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={session?.user?.email || ""}
      />
    </nav>
  );
}