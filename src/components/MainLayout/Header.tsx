import { Menu, Bell, Search } from "lucide-react";
import InputFields from "../Common/InputFields";
import { useAuthStore } from "@stores/authStore";
import { capitalizeFirst } from "@utils/stringUtils";

type HeaderProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Header({ open, setOpen }: HeaderProps) {

    const { role, email } = useAuthStore()

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                {/* Toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                >
                    <Menu size={22} />
                </button>

            </div>

            <div className="flex items-center gap-6">

                {/* User */}
                <div className="hidden sm:block text-right">
                    <div className="text-sm font-semibold text-gray-800">{capitalizeFirst(role)}</div>
                    <div className="text-xs text-gray-500">{email}</div>
                </div>

            </div>
        </header>
    );
}