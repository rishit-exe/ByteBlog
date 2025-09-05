"use client";

import { useState } from "react";
import { deleteUserAccount } from "@/app/actions";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function DeleteAccountModal({ 
  isOpen, 
  onClose, 
  userEmail 
}: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmationText !== userEmail) {
      setError("Please type your email address exactly as shown");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteUserAccount(confirmationText, userEmail);
      
      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
        return;
      }

      // Account deleted successfully, sign out and redirect
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 border border-red-500/50 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
        {/* Neon glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 blur-xl -z-10" />
        
        {/* Content */}
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-500/20 border border-red-500/50">
            <svg 
              className="w-8 h-8 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-4">
            Delete Account?
          </h3>
          
          {/* Warning Message */}
          <div className="text-left mb-6">
            <p className="text-red-400 text-sm font-medium mb-4">
              ⚠️ This action cannot be undone!
            </p>
            <p className="text-gray-300 text-sm mb-2">
              This will permanently delete:
            </p>
            <ul className="text-gray-400 text-sm list-disc list-inside mb-4">
              <li>Your account and profile</li>
              <li>All your blog posts</li>
              <li>All your likes and bookmarks</li>
            </ul>
          </div>
          
          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">
              Type your email address to confirm:
            </label>
            <p className="text-blue-400 text-sm mb-2 font-mono bg-blue-500/10 px-2 py-1 rounded">
              {userEmail}
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type your email address here..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmationText !== userEmail}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500 shadow-lg shadow-red-500/25 relative overflow-hidden"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
