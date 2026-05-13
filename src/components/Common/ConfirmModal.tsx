import { type ReactNode } from "react";

type ConfirmModalProps = {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
    disableCancel?: boolean; // ✅ NEW
};

export function ConfirmModal({
    open,
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    children,
    disableCancel = false, // ✅ default
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg p-6">

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {title}
                </h2>

                {/* Message */}
                {message && (
                    <p className="text-sm text-gray-500 mb-4">{message}</p>
                )}

                {children}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">

                    {/* Cancel */}
                    {!disableCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                        >
                            {cancelText}
                        </button>
                    )}

                    {/* Confirm */}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
                    >
                        {confirmText}
                    </button>

                </div>
            </div>
        </div>
    );
}