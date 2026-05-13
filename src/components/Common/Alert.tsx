import { type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

type AlertProps = {
    variant?: AlertVariant;
    title?: string;
    description?: string;
    onClose?: () => void;
    children?: ReactNode;
};

const variantStyles: Record<AlertVariant, string> = {
    success:
        "bg-[var(--color-primary)]/10 text-[var(--color-primary-deep)] border-[var(--color-primary)]/20",
    error:
        "bg-[var(--color-red-50)] text-[var(--color-red-700)] border-[var(--color-red-200)]",
    warning:
        "bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border-[var(--color-tertiary)]/20",
    info:
        "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/20",
};

const icons: Record<AlertVariant, ReactNode> = {
    success: <CheckCircle size={18} />,
    error: <AlertTriangle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
};

export function Alert({
    variant = "info",
    title,
    description,
    onClose,
    children,
}: AlertProps) {
    return (
        <div
            className={`w-full border rounded-[var(--radius-md)] px-4 py-3 flex items-start gap-3 shadow-sm animate-[shake_0.3s_ease-in-out]
      ${variantStyles[variant]}`}
        >
            {/* Icon */}
            <div className="mt-0.5">{icons[variant]}</div>

            {/* Content */}
            <div className="flex-1">
                {title && (
                    <div className="font-semibold text-sm">{title}</div>
                )}
                {description && (
                    <div className="text-sm opacity-90">{description}</div>
                )}
                {children}
            </div>

            {/* Close */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}