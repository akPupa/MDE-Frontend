type SelectProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
    options: { label: string; value: string }[];
    error?: string;
    touched?: boolean;
};

export function Select({
    label,
    name,
    value,
    onChange,
    onBlur,
    options,
    error,
    touched,
}: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 bg-white ${error && touched ? "border-red-300" : "border-gray-300"
                    }`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && touched && (
                <span className="text-xs text-red-400">{error}</span>
            )}
        </div>
    );
}
