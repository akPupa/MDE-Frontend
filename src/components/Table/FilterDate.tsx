import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar2Date } from "react-icons/bs";

type Props = {
  label: string;
  value?: string;
  onChange: (date: Date | null) => void;
};

export default function FilterDate({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 ">
      <label className="text-xs text-gray-500">{label}</label>

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date: Date | null) => onChange(date)}
        placeholderText="Select date"
        className="border border-border rounded-lg px-2! py-2! text-sm min-w-[150px] cursor-pointer! focus:outline-none"
        icon={<BsCalendar2Date />}
        showIcon
        calendarIconClassName="right-0 h-full pointer-events-none"
      />
    </div>
  );
}
