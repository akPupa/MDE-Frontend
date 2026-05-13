import { PrimaryButton } from "@components/Common/PrimaryButton";
import { PageHeader } from "@components/MainLayout/PageHeader";
import { StatsGrid } from "@components/Stats/StatsGrid";
import type { StatsItem } from "@components/Stats/types";
import ServerDynamicTable from "@components/Table/ServerDynamicTable";
import type {
  TableHeader,
  ServerTableProps,
  TableRow,
  Filter,
} from "@components/Table/types";
import UserCreateModal from "@components/Users/UserCreateModal";

import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

import { getAllUsers } from "@api/users";

/* ================= TABLE ================= */

const headers: TableHeader[] = [
  { key: "name", label: "Name", align: "left" },
  { key: "email", label: "Email", align: "left" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
  { key: "action", label: "Action" },
];

const filters: Filter[] = [
  {
    key: "isActive",
    label: "Status",
    type: "select",
    options: [{ label: "Active", value: true }, { label: "Inactive", value: false }],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
      // { label: "DEV", value: "DEV" },
      { label: "PROVIDER", value: "PROVIDER" },
    ]
  },
];

/* ================= STATS ================= */


/* ================= PAGE ================= */

export default function Page() {
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsData, setStatsData] = useState<StatsItem[]>([
    {
      label: "Total Users",
      value: "-",
      icon: Users,
      stat: "",
      variant: "green",
    },
    {
      label: "Active Users",
      value: "-",
      icon: FaUserCheck,
      stat: "",
      variant: "blue",
    },
    {
      label: "Inactive Users",
      value: "-",
      icon: FaUserSlash,
      stat: "",
      variant: "red",
    },
  ]);

  /* ================= FETCH ================= */

  const fetchData: ServerTableProps["fetchData"] = async ({
    search,
    filters,
    page,
    pageSize,
  }) => {
    try {
      const res = await getAllUsers({
        page,
        pageSize,
        search,
        role: filters.role as any,
        isActive: filters.isActive as any
      });

      if (res.stats) {
        setStatsData([
          {
            label: "Total Users",
            value: res.stats.totalUsers,
            icon: Users,
            stat: "",
            variant: "green",
          },
          {
            label: "Active Users",
            value: res.stats.activeUsers,
            icon: FaUserCheck,
            stat: "",
            variant: "blue",
          },
          {
            label: "Inactive Users",
            value: res.stats.inactiveUsers,
            icon: FaUserSlash,
            stat: "",
            variant: "red",
          },
        ]);
      }

      const rows: TableRow[] = res.rows.map((user) => ({
        name: { type: "text", value: user.fullName },
        email: { type: "text", value: user.email },

        status: {
          type: "pill",
          value: user.isActive ? "Active" : "Inactive",
          color: user.isActive ? "green" : "red",
        },

        role: {
          type: "text",
          value: user.role,
        },

        action: {
          type: "button",
          element: (
            <PrimaryButton label="Edit" hollow variant="rounded" />
          ),
          onClick: () => {
            setEditUser(user);
            setOpen(true);
          },
        },
      }));

      return {
        rows,
        total: res.total,
      };
    } catch (error) {
      console.error("Fetch users error:", error);
      return { rows: [], total: 0 };
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between">
        <PageHeader
          title="User Management"
          subtitle="Manage providers and admins"
        />

        <PrimaryButton
          label="Add User"
          icon={Plus}
          onClick={() => {
            setEditUser(null);
            setOpen(true);
          }}
        />
      </div>

      {/* STATS */}
      <StatsGrid data={statsData} />

      {/* MODAL */}
      <UserCreateModal
        open={open}
        setOpen={setOpen}
        mode={editUser ? "edit" : "create"}
        initialData={editUser || undefined}
        onSuccess={() => {
          setEditUser(null);
          setRefreshKey((prev) => prev + 1); // refresh table
        }}
      />

      {/* TABLE */}
      <ServerDynamicTable
        key={refreshKey}
        headers={headers}
        filters={filters}
        searchPlaceholder="Search users..."
        defaultPageSize={10}
        fetchData={fetchData}
      />
    </div>
  );
}