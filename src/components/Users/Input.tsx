import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    touched?: boolean;
};

export function Input({
    label,
    error,
    touched,
    className,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>

            <input
                {...props}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${error && touched ? "border-red-300" : "border-gray-300"
                    } ${className || ""}`}
            />

            {error && touched && (
                <span className="text-xs text-red-400">{error}</span>
            )}
        </div>
    );
}