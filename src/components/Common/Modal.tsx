import { type ReactNode } from "react";

type ModalProps = {
    open: boolean;
    title: string;
    subtitle?: string;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    children: ReactNode;
};

export default function Modal({
    open,
    title,
    subtitle,
    onCancel,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    children,
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* HEADER (fixed) */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start ">
                    <div>
                        <h3 className="text-2xl font-extrabold tracking-tight">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                        )}
                    </div>

                    <button
                        onClick={onCancel}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* BODY (scrollable) */}
                <div className="px-8 py-4 space-y-6 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* FOOTER (fixed) */}
                <div className="px-8 pb-6 pt-4 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-full"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}