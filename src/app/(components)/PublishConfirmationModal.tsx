"use client";

interface PublishConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  action: "create" | "update";
  isProcessing?: boolean;
}

export default function PublishConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  action,
  isProcessing = false
}: PublishConfirmationModalProps) {
  if (!isOpen) return null;

  const isCreate = action === "create";
  const actionText = isCreate ? "Publish" : "Update";
  const actionColor = isCreate ? "blue" : "green";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 border border-blue-500/50 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
        {/* Neon glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-xl -z-10" />
        
        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/50">
            <svg 
              className="w-8 h-8 text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-4">
            {actionText} Post?
          </h3>
          
          {/* Message */}
          <p className="text-gray-300 mb-2">
            {isCreate ? "Are you ready to publish this post?" : "Are you sure you want to update this post?"}
          </p>
          <p className="text-sm text-gray-400 mb-6 italic">
            "{title}"
          </p>
          <p className="text-blue-400 text-sm font-medium mb-8">
            {isCreate ? "Your post will be visible to everyone!" : "Changes will be saved and visible to readers."}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-6 py-2 ${
                isCreate 
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-500 shadow-blue-500/25" 
                  : "bg-green-600 hover:bg-green-700 border-green-500 shadow-green-500/25"
              } text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border shadow-lg relative overflow-hidden`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isCreate ? "Publishing..." : "Updating..."}
                </span>
              ) : (
                `${actionText} Post`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
