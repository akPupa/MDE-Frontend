import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    type ChartOptions,
    type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { AiUsageOverTimeItem } from "@api/cases";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type UsageChartCardProps = {
    data?: AiUsageOverTimeItem[];
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

const filterByRange = (items: AiUsageOverTimeItem[], range: "7" | "30") => {
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-Number(range));
};

const formatTokens = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function UsageChartCard({ data = [], isLoading = false, error = "" }: UsageChartCardProps) {
    const [range, setRange] = useState<"7" | "30">("7");

    const current = filterByRange(data, range);
    const hasData = current.length > 0;

    const chartData: ChartData<"bar"> = {
        labels: current.map((item) => formatLabel(item.date)),
        datasets: [
            {
                label: "Tokens",
                data: current.map((item) => item.totalTokens),
                backgroundColor: "#029185",
                borderRadius: 6,
                maxBarThickness: 42,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 10,
                callbacks: {
                    label: (context) => `Tokens: ${formatTokens(Number(context.raw ?? 0))}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 10 },
                },
            },
            y: {
                grid: { color: "#f3f4f6" },
                ticks: {
                    color: "#9ca3af",
                    callback: (value) => formatTokens(Number(value)),
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-lg font-bold">
                        AI usage per day
                    </h4>
                    <p className="text-sm text-gray-500">
                        Daily token consumption from generated reports
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    {/* Legend */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Tokens
                        </div>
                    </div>

                    {/* Filter */}
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value as "7" | "30")}
                        className="bg-gray-100 rounded-md text-xs font-semibold px-3 py-1.5 focus:outline-none"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="h-40 w-full">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                        Loading AI usage...
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-red-600">
                        {error}
                    </div>
                ) : hasData ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                        No AI usage data found.
                    </div>
                )}
            </div>
        </div>
    );
}
