import Select from "react-select";
import type { FilterValue, Option } from "./types";

type Props = {
  label: string;
  value?: FilterValue;
  options: Option[];
  onChange: (value: FilterValue) => void;
};

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: Props) {
  const selectedOption =
    options.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col gap-1 min-w-[150px]">
      <label className="text-xs text-gray-500">{label}</label>

      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value ?? null)}
        isClearable
        placeholder="All"
        className="min-w-[150px]"
        classNames={{
          control: () =>
            "rounded-lg border border-border shadow-none hover:border-gray-300",
        }}
      />
    </div>
  );
}