import { type ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa"; // ✅ spinner

type PrimaryButtonProps = {
    label: string;
    hollow?: boolean;
    className?: string;
    icon?: IconType;
    iconPosition?: "left" | "right";
    variant?: "pill" | "rounded";
    loading?: boolean; // ✅ added
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
    label,
    hollow = false,
    className = "",
    icon: Icon,
    iconPosition = "left",
    variant = "pill",
    loading = false,
    disabled,
    ...props
}: PrimaryButtonProps) {
    const isDisabled = loading || disabled;

    const baseStyles =
        `max-h-10 inline-flex justify-center items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 ${variant == "pill" ? "rounded-full" : "rounded-md"}`;

    const filledStyles =
        "bg-primary text-white hover:bg-primary/90";

    const hollowStyles =
        "bg-white text-primary border border-primary hover:bg-primary/10";

    const disabledStyles =
        "opacity-50 cursor-not-allowed hover:bg-primary"; // prevents hover effect

    return (
        <button
            className={`${baseStyles} 
                ${hollow ? hollowStyles : filledStyles} 
                ${isDisabled ? disabledStyles : ""} 
                ${className}`}
            disabled={isDisabled}
            {...props}
        >
            {/* Left Icon / Spinner */}
            {iconPosition === "left" && (
                loading
                    ? <FaSpinner size={16} className="animate-spin" />
                    : Icon && <Icon size={16} />
            )}

            {label}

            {/* Right Icon / Spinner */}
            {iconPosition === "right" && (
                loading
                    ? <FaSpinner size={16} className="animate-spin" />
                    : Icon && <Icon size={16} />
            )}
        </button>
    );
}