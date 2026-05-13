import { PrimaryButton } from "@components/Common/PrimaryButton";
import { UsageChartCard } from "@components/Dashboard/UsageChartCard";
import { PageHeader } from "@components/MainLayout/PageHeader";
import { StatsGrid } from "@components/Stats/StatsGrid";
import SectionWiseTime from "@components/Common/ProgressBar";
import type { StatsItem } from "@components/Stats/types";
import ServerDynamicTable from "@components/Table/ServerDynamicTable";
import type { TableHeader, ServerTableProps, TableRow } from "@components/Table/types";
import { ArrowBigDownDash, Download, Gauge, Timer, Zap } from "lucide-react";

/* ─── TABLE HEADERS ─────────────────────────────────────────────────── */
const headers: TableHeader[] = [
    { key: "caseid", label: "CASE ID", align: "left" },
    { key: "totalprocessing", label: "TOTAL PROCESSING", align: "left" },
    { key: "mdsection", label: "MD SECTION", align: "left" },
    { key: "ptsection", label: "PT SECTION", align: "left" },
    { key: "psychsection", label: "PSYCH SECTION", align: "left" },
    { key: "status", label: "STATUS", align: "left" },
];

/* ─── STATUS PILL CONFIG ─────────────────────────────────────────────── */
type StatusKey = "SUCCESS" | "SLOW LINK" | "PEAK";

const statusConfig: Record<StatusKey, { color: "green" | "orange" | "yellow" }> = {
    "SUCCESS": { color: "green" },
    "SLOW LINK": { color: "orange" },
    "PEAK": { color: "yellow" },
};

/* ─── DUMMY DATA (matches screenshot) ───────────────────────────────── */
const rawData: {
    id: string;
    total: string;
    md: string;
    pt: string;
    psych: string;
    status: StatusKey;
}[] = [
        { id: "#SA-8821", total: "4.1s", md: "1.7s", pt: "1.1s", psych: "1.3s", status: "SUCCESS" },
        { id: "#SA-8822", total: "12.8s", md: "5.4s", pt: "3.2s", psych: "4.2s", status: "SLOW LINK" },
        { id: "#SA-8823", total: "3.9s", md: "1.5s", pt: "1.0s", psych: "1.4s", status: "SUCCESS" },
        { id: "#SA-8824", total: "2.1s", md: "0.8s", pt: "0.6s", psych: "0.7s", status: "PEAK" },
        { id: "#SA-8825", total: "4.8s", md: "1.9s", pt: "1.4s", psych: "1.5s", status: "SUCCESS" },
        { id: "#SA-8826", total: "6.3s", md: "2.4s", pt: "2.0s", psych: "1.9s", status: "SUCCESS" },
        { id: "#SA-8827", total: "9.1s", md: "3.9s", pt: "2.5s", psych: "2.7s", status: "SLOW LINK" },
        { id: "#SA-8828", total: "3.4s", md: "1.2s", pt: "0.9s", psych: "1.3s", status: "SUCCESS" },
        { id: "#SA-8829", total: "2.8s", md: "0.9s", pt: "0.7s", psych: "1.2s", status: "PEAK" },
        { id: "#SA-8830", total: "5.5s", md: "2.1s", pt: "1.8s", psych: "1.6s", status: "SUCCESS" },
    ];

const dummyData: TableRow[] = rawData.map((row) => {
    const cfg = statusConfig[row.status];
    return {
        caseid: { type: "link", value: row.id },
        totalprocessing: { type: "text", value: row.total },
        mdsection: { type: "text", value: row.md },
        ptsection: { type: "text", value: row.pt },
        psychsection: { type: "text", value: row.psych },
        status: { type: "pill", value: row.status, color: cfg.color },
    } satisfies TableRow;
});

/* ─── FETCH (simulated) ──────────────────────────────────────────────── */
const fetchData: ServerTableProps["fetchData"] = async ({ page, pageSize }) => {
    await new Promise((res) => setTimeout(res, 300));
    const total = dummyData.length;
    const start = (page - 1) * pageSize;
    return { rows: dummyData.slice(start, start + pageSize), total };
};

/* ─── STATS ──────────────────────────────────────────────────────────── */
const statsData: StatsItem[] = [
    {
        label: "AVG REPORT PROCESSING",
        value: "4.2s",
        icon: Timer,
        stat: "-0.4s",
        variant: "green",
    },
    {
        label: "AVG SECTION GEN",
        value: "1.4s",
        icon: Zap,
        stat: "Optimal",
        variant: "blue",
    },
    {
        label: "FASTEST REPORT",
        value: "2.1s",
        icon: Gauge,
        stat: "Record",
        variant: "green",
    },
    {
        label: "SLOWEST REPORT",
        value: "12.8s",
        icon: ArrowBigDownDash,
        stat: "+2.1s",
        variant: "red",
    },
];

/* ─── PAGE ───────────────────────────────────────────────────────────── */
export default function Page() {
    return (
        <div className="flex flex-col gap-4">

            {/* Header */}
            <PageHeader
                title="System Overview"
                subtitle="Real-time clinical automation performance and health."
            />

            {/* Stats row */}
            <StatsGrid data={statsData} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <UsageChartCard />
                </div>
                <div className="lg:col-span-1">
                    <SectionWiseTime
                        items={[
                            { label: "Medical Doctor (MD)", value: "1.8s", percentage: 75 },
                            { label: "Physiotherapy (PT)", value: "1.2s", percentage: 50 },
                            { label: "Psychology (Psych)", value: "1.5s", percentage: 65 }
                        ]}
                        insight="Physiotherapy section generation remains the most efficient across all clinical categories."
                    />
                </div>
            </div>
            {/* Recent Transaction Logs table */}
            <ServerDynamicTable
                headers={headers}
                defaultPageSize={5}
                fetchData={fetchData}
                title="Recent Transaction Logs"
            // actionButton={
            //     <button
            //         className="flex items-center gap-1.5 text-sm font-medium text-[#029185] hover:text-[#00796b] transition-colors"
            //         onClick={() => alert("Exporting CSV…")}
            //     >
            //         <Download size={15} />
            //         Export CSV
            //     </button>
            // }
            />
        </div>
    );
}