type ToggleProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export function Toggle({ label, checked, onChange }: ToggleProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => onChange(!checked)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-blue-600" : "bg-gray-200"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
                <span className={`text-sm font-semibold ${checked ? "text-blue-600" : "text-gray-400"}`}>
                    {checked ? "Active" : "Inactive"}
                </span>
            </div>
        </div>
    );
}
