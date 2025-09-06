"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";

interface AuthMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "info" | "warning" | "error";
}

export default function AuthMessageModal({ 
  isOpen, 
  onClose, 
  message, 
  type = "info" 
}: AuthMessageModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: "text-yellow-400",
          text: "text-yellow-100"
        };
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: "text-red-400",
          text: "text-red-100"
        };
      default:
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          icon: "text-blue-400",
          text: "text-blue-100"
        };
    }
  };

  const styles = getTypeStyles();

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 z-[10000] ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${styles.bg} ${styles.border} border rounded-xl p-6 shadow-2xl backdrop-blur-md`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
              <h3 className={`text-lg font-semibold ${styles.text}`}>
                Sign In Required
              </h3>
            </div>
            <button
              onClick={(e) => handleClose(e)}
              className="text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className={`${styles.text} mb-6 leading-relaxed`}>
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={(e) => handleClose(e)}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
              type="button"
            >
              Cancel
            </button>
            <a
              href="/auth/signin"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-center"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
