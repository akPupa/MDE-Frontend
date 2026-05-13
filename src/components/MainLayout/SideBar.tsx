import { useAuthStore } from "@stores/authStore";
import { useConfirmStore } from "@stores/confirmStore";
import {
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import type { IconType } from "react-icons";
import { MdCreateNewFolder } from "react-icons/md";
import { NavLink } from "react-router-dom";

type NavItem = {
  name: string;
  icon: IconType;
  path: string;
  roles: string[];
};

type SidebarProps = {
  open: boolean;
};

const ROLES = {
  ADMIN: "SUPER_ADMIN",
  DEV: "DEV",
  PROVIDER: "PROVIDER",
};

export function Sidebar({ open }: SidebarProps) {
  const { logout, user } = useAuthStore();
  const role = user?.role

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      roles: [ROLES.ADMIN, ROLES.DEV, ROLES.PROVIDER],
    },
    {
      name: "Template and Prompts",
      icon: FileText,
      path: "/templates",
      roles: [ROLES.ADMIN, ROLES.DEV],
    },
    {
      name: "Users Management",
      icon: Users,
      path: "/users",
      roles: [ROLES.ADMIN, ROLES.DEV],
    },
    {
      name: "Create Report",
      icon: MdCreateNewFolder,
      path: "/create-report",
      roles: [ROLES.DEV, ROLES.PROVIDER],
    },
    {
      name: "Report Logs",
      icon: History,
      path: "/report-logs",
      roles: [ROLES.ADMIN, ROLES.DEV, ROLES.PROVIDER],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => role && item.roles.includes(role)
  );

  const { show } = useConfirmStore();

  const handleLogout = () => {
    show({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: () => {
        logout()

      },

    });
  };

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 shadow-sm
  transition-[width] duration-300 ease-in-out overflow-hidden shrink-0
  ${open ? "w-64" : "w-20"}`}
    >
      <div className="flex flex-col h-full py-6">
        <div
          className={`flex items-center mb-8 transition-all duration-300 ease-in-out
          ${open ? "px-6 justify-start" : "justify-center px-0"}`}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
            M
          </div>

          <div
            className={`ml-3 transition-all duration-300 ease-in-out overflow-hidden
            ${open ? "opacity-100 translate-x-0 max-w-[200px]" : "opacity-0 -translate-x-2 max-w-0"}`}
          >
            <div className="font-bold text-primary text-base whitespace-nowrap">
              MDE Automation
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Clinical Precision
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {filteredNavItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={i}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full py-3 rounded-md transition-all duration-200
                  ${open ? "justify-start px-4" : "justify-center pl-2"}
                  ${isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                  }`
                }
              >
                <Icon size={20} />
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-200 ease-in-out
                  ${open
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden"}`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-2 mt-auto border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full py-3 rounded-md text-red-500 hover:bg-red-100 transition-all duration-200
            ${open ? "justify-start px-4" : "justify-center pl-2"}`}
          >
            <LogOut size={20} />
            <span
              className={`text-sm transition-all duration-200 ease-in-out
              ${open
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 w-0 overflow-hidden"}`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}