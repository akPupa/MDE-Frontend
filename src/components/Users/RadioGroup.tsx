import React from "react";

type RadioOption = {
    label: string;
    value: string;
};

type RadioGroupProps = {
    label: string;
    name: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    error?: string;
    touched?: boolean;
    direction?: "row" | "column";
};

export function RadioGroup({
    label,
    name,
    value,
    options,
    onChange,
    error,
    touched,
    direction = "row",
}: RadioGroupProps) {
    return (
        <div className="flex flex-col gap-1">

            {/* Label */}
            <label className="text-sm font-medium">{label}</label>

            {/* Options */}
            <div
                className={`flex gap-6 ${direction === "column" ? "flex-col" : "flex-row"
                    }`}
            >
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="accent-blue5600 w-4 h-4"
                        />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>

            {/* Error */}
            {error && touched && (
                <span className="text-xs text-red-400">{error}</span>
            )}
        </div>
    );
}