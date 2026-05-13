import { PrimaryButton } from "@components/Common/PrimaryButton";
import { PageHeader } from "@components/MainLayout/PageHeader";
import ServerDynamicTable from "@components/Table/ServerDynamicTable";
import type {
    Filter,
    ServerTableProps,
    TableHeader,
    TableRow,
} from "@components/Table/types";
import { format } from "date-fns";
import { Plus } from "lucide-react";

const headers: TableHeader[] = [
    { key: "patient_name", label: "Patient Name", },
    { key: "case_id", label: "id", },
    { key: "date_created", label: "Date Created" },
    { key: "status", label: "Status" },
];
const filters: Filter[] = [
    {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Active", "Inactive"],
    },
    {
        key: "date_created",
        label: "Date Created",
        type: "date",

    },
];


export default function Page() {
    const dummyData: TableRow[] = Array.from({ length: 57 }).map((_, i) => {
        const isActive = i % 2 === 0;

        return {
            patient_name: { type: "text", value: `User ${i + 1}` },
            case_id: { type: "text", value: `case_${i + 1}` },
            status: {
                type: "pill",
                value: isActive ? "Active" : "Inactive",
                color: isActive ? "green" : "red",
            },
            date_created: {
                type: "text",
                value: format(new Date(), "hh:mm aa, MM/dd/yyyy"),

            },
        } satisfies TableRow;
    });

    const fetchData: ServerTableProps["fetchData"] = async ({
        search,
        filters,
        page,
        pageSize,
    }) => {
        await new Promise((res) => setTimeout(res, 500));

        let data = [...dummyData];

        if (search) {
            data = data.filter((item) =>
                Object.values(item).some((cell) =>
                    String(cell.value).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;

            data = data.filter((item) => {
                const cell = item[key];
                return cell?.value === value;
            });
        });

        const total = data.length;

        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        return {
            rows: data.slice(start, end),
            total,
        };
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <PageHeader
                    title="User Management"
                    subtitle="Manage providers and admins"
                />

                <PrimaryButton
                    label="Create Report"
                    icon={Plus}
                />
            </div>

            <ServerDynamicTable
                headers={headers}
                filters={filters}
                searchPlaceholder="Search users..."
                defaultPageSize={10}
                fetchData={fetchData}
            />
        </div>
    );
}