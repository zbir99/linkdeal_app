import React from 'react';

interface UnsavedChangesModalProps {
    /** Whether the modal is visible */
    isOpen: boolean;
    /** Handler for "Stay on Page" button */
    onStay: () => void;
    /** Handler for "Leave Anyway" button */
    onLeave: () => void;
    /** Optional custom title */
    title?: string;
    /** Optional custom message */
    message?: string;
}

/**
 * Modal component to warn users about losing unsaved changes.
 * Styled to match the app's dark theme.
 */
export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
    isOpen,
    onStay,
    onLeave,
    title = 'Unsaved Changes',
    message = 'You have unsaved changes. Are you sure you want to leave? Your progress will be lost.',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onStay}
            />

            {/* Modal */}
            <div className="relative bg-[#1a1a2e] border border-[#6d28d933] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-purple-500/20 animate-in fade-in zoom-in duration-200">
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white text-center mb-2">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-white/70 text-center text-sm mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onLeave}
                        className="flex-1 py-3 px-4 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors font-medium"
                    >
                        Leave Anyway
                    </button>
                    <button
                        onClick={onStay}
                        className="flex-1 py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors font-medium"
                    >
                        Stay on Page
                    </button>
                </div>

                {/* Subtle hint */}
                <p className="text-white/40 text-xs text-center mt-4">
                    Press Escape to stay on this page
                </p>
            </div>
        </div>
    );
};

export default UnsavedChangesModal;
