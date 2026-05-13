import { useState } from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler,
    type ChartOptions,
    type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ReportsOverTimeItem } from "@api/cases";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
);

type ReportsChartCardProps = {
    data?: ReportsOverTimeItem[];
    isLoading?: boolean;
    error?: string;
};

const formatLabel = (date: string) => {
    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(parsed);
};

const filterByRange = (items: ReportsOverTimeItem[], range: "7" | "30") => {
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-Number(range));
};

export function ReportsChartCard({ data = [], isLoading = false, error = "" }: ReportsChartCardProps) {
    const [range, setRange] = useState<"7" | "30">("30");

    const current = filterByRange(data, range);
    const hasData = current.length > 0;

    const chartData: ChartData<"line"> = {
        labels: current.map((item) => formatLabel(item.date)),
        datasets: [
            {
                label: "Reports",
                data: current.map((item) => item.count),
                borderColor: "#029185",
                backgroundColor: "rgba(2,145,133,0.1)",
                fill: true,
                tension: 0.2,
                pointRadius: 0
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false,
        },

        plugins: {
            legend: { display: false },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 10,
                callbacks: {
                    label: (context) => `Reports: ${context.formattedValue}`,
                },
            },
        },

        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                grid: { color: "#f3f4f6" },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-lg font-bold">
                        Reports generated over time
                    </h4>
                    <p className="text-sm text-gray-500">
                        Daily volume of automated clinical documentation
                    </p>
                </div>

                {/* Dropdown */}
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value as "7" | "30")}
                    className="bg-gray-100 rounded-md text-xs font-semibold px-3 py-1.5 focus:outline-none"
                >
                    <option value="30">Last 30 Days</option>
                    <option value="7">Last 7 Days</option>
                </select>
            </div>

            {/* Chart */}
            <div className="h-72 w-full">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                        Loading reports...
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-red-600">
                        {error}
                    </div>
                ) : hasData ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                        No report data found.
                    </div>
                )}
            </div>
        </div>
    );
}
