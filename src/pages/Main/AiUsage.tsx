import Modal from "@components/Common/Modal";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import { PageHeader } from "@components/MainLayout/PageHeader";
import Overview, { type DayData } from "@components/ReportLogs/Overview";
import { StatsGrid } from "@components/Stats/StatsGrid";
import type { StatsItem } from "@components/Stats/types";
import ServerDynamicTable from "@components/Table/ServerDynamicTable";
import type {
    TableHeader,
    ServerTableProps,
    TableRow,
    Filter,
} from "@components/Table/types";
import { Brain, Plus } from "lucide-react";
import { useState } from "react";
import { FaDatabase } from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";

/* HEADERS */
const headers: TableHeader[] = [
    { key: "name", label: "Name", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "status", label: "Status" },
    { key: "role", label: "Role" },
    { key: "city", label: "City" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "Action" },
];

/* FILTERS */
const filters: Filter[] = [
    {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
    },
    {
        key: "role",
        label: "Role",
        type: "select",
        options: ["Admin", "User"],
    },
    {
        key: "city",
        label: "City",
        type: "select",
        options: ["Chennai", "Bangalore", "Mumbai"],
    },
    {
        key: "startDate",
        label: "Start Date",
        type: "date",
    },
    {
        key: "endDate",
        label: "End Date",
        type: "date",
    },
];

/* DUMMY DATA */
const dummyData: TableRow[] = Array.from({ length: 57 }).map((_, i) => {
    const isActive = i % 2 === 0;

    const roles = ["Admin", "User"];
    const cities = ["Chennai", "Bangalore", "Mumbai"];

    const randomDate = new Date(
        2026,
        3,
        Math.floor(Math.random() * 30) + 1,
    ).toISOString();

    return {
        name: { type: "text", value: `User ${i + 1}` },
        email: { type: "text", value: `user${i + 1}@mail.com` },
        status: {
            type: "pill",
            value: isActive ? "Active" : "Inactive",
            color: isActive ? "green" : "red",
        },
        role: { type: "text", value: roles[i % roles.length] },
        city: { type: "text", value: cities[i % cities.length] },
        createdAt: {
            type: "text",
            value: randomDate,
        },
        action: {
            type: "button",
            value: "View",
            onClick: () => alert(`Clicked User ${i + 1}`),
        },
    } satisfies TableRow;
});

/* FETCH DATA */
const fetchData: ServerTableProps["fetchData"] = async ({
    search,
    filters,
    page,
    pageSize,
}) => {
    await new Promise((res) => setTimeout(res, 500));

    let data = [...dummyData];

    /* SEARCH */
    if (search) {
        data = data.filter((item) =>
            Object.values(item).some((cell) =>
                String(cell.value).toLowerCase().includes(search.toLowerCase()),
            ),
        );
    }

    const startDate = filters["startDate"];
    const endDate = filters["endDate"];

    /* NORMAL FILTERS */
    Object.entries(filters).forEach(([key, value]) => {
        if (!value) return;
        if (key === "startDate" || key === "endDate") return;

        data = data.filter((item) => {
            const cell = item[key];
            return cell?.value === value;
        });
    });

    /* DATE FILTER */
    if (startDate || endDate) {
        data = data.filter((item) => {
            const cell = item["createdAt"];
            if (!cell?.value) return false;

            const date = new Date(cell.value as string);

            if (startDate && date < new Date(startDate)) return false;
            if (endDate && date > new Date(endDate)) return false;

            return true;
        });
    }

    const total = data.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        rows: data.slice(start, end),
        total,
    };
};

/* STATS */
const statsData: StatsItem[] = [
    {
        label: "Total token used",
        value: "1.2M/ 45M limit",
        icon: IoMdCube,
        stat: "LIVE",
        variant: "green",
    },
    {
        label: "Estimated Cost",
        value: "$123.50",
        icon: MdAttachMoney,
        stat: "-12%",
        variant: "blue",
    },
    {
        label: "Total Request",
        value: "12,840",
        icon: FaDatabase,
        stat: "+10",
        variant: "red",
    },
    {
        label: "Active Modal",
        value: "GPT-4o",
        icon: Brain,
        variant: "yellow",
    },
];


export default function Page() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <PageHeader title="Ai Usage" subtitle="Real-time resource allocation and clinical model performance metrics." />
                <PrimaryButton
                    label="Add User"
                    icon={Plus}
                    onClick={() => setOpen(true)}
                />
            </div>

            <StatsGrid data={statsData} />

            <ServerDynamicTable
                headers={headers}
                filters={filters}
                searchPlaceholder="Search users..."
                pageSizeOptions={[5, 10, 20]}
                defaultPageSize={10}
                fetchData={fetchData}
                // actionButton={<PrimaryButton label="Export" variant="rounded" />}
                title="Usage Logs"
            />

        </div>
    );
}
