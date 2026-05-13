import { ReportsChartCard } from "@components/Dashboard/ReportsChartCard";
import { UsageChartCard } from "@components/Dashboard/UsageChartCard";
import { PageHeader } from "@components/MainLayout/PageHeader";
import { StatsGrid } from "@components/Stats/StatsGrid";
import type { StatsItem } from "@components/Stats/types";
import {
  ActivityIcon,
  AlertTriangle,
  Cpu,
  FileText,
} from "lucide-react";
import { SystemHealthCard } from "@components/Dashboard/SystemHealthCard";
import { useAuthStore } from "@stores/authStore";
import {
  getAiUsageOverTime,
  getCaseStats,
  getReportsOverTime,
  type AiUsageOverTimeItem,
  type CaseStatsResponse,
  type ReportsOverTimeItem,
} from "@api/cases";
import { useEffect, useMemo, useState } from "react";

const adminStatsData: StatsItem[] = [
  {
    label: "Total Reports Generated",
    value: "12,450",
    icon: FileText,
    stat: "+5% vs last week",
    variant: "green",
  },
  {
    label: "Active Cases",
    value: "842",
    icon: ActivityIcon,
    stat: "Steady",
    variant: "blue",
  },
  {
    label: "Failed Generations",
    value: "12",
    icon: AlertTriangle,
    stat: "Critical",
    variant: "red",
  },
  {
    label: "AI Usage (today)",
    value: "8.4M Tokens",
    icon: Cpu,
    stat: "Optimized",
    variant: "yellow",
  },
];

const defaultSystemHealth = {
  apiStatus: "online" as const,
  uptime: "99.98%",
  queue: 42,
  avgTime: "1.2s",
  modules: [
    { name: "Text Analysis Engine", status: "healthy" as const },
    { name: "Vector Database", status: "healthy" as const },
    { name: "Compliance Validator", status: "error" as const },
  ],
};

const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Failed to load dashboard stats";

const formatTokens = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M Tokens`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K Tokens`;
  }

  return `${formatCount(value)} Tokens`;
};

const formatProcessingTime = (value: number) => {
  if (!value) {
    return "0ms";
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`;
  }

  return `${Math.round(value)}ms`;
};

const normalizeStatus = (status: string): "online" | "offline" =>
  status.toLowerCase() === "online" ? "online" : "offline";

const buildStatsData = (stats: CaseStatsResponse): StatsItem[] => [
  {
    label: "Total Reports Generated",
    value: formatCount(stats.totalReports),
    icon: FileText,
    stat: `${formatCount(stats.aiUsageCount)} AI runs`,
    variant: "green",
  },
  {
    label: "Active Cases",
    value: formatCount(stats.activeCases),
    icon: ActivityIcon,
    stat: `${formatCount(stats.queueMetrics.total)} queued`,
    variant: "blue",
  },
  {
    label: "Failed Generations",
    value: formatCount(stats.failedGenerations),
    icon: AlertTriangle,
    stat: stats.failedGenerations > 0 ? "Needs review" : "Clear",
    variant: stats.failedGenerations > 0 ? "red" : "green",
  },
  {
    label: "AI Usage",
    value: formatTokens(stats.totalTokens),
    icon: Cpu,
    stat: `${formatCount(stats.aiUsageCount)} requests`,
    variant: "yellow",
  },
];

const buildSystemHealth = (stats: CaseStatsResponse) => ({
  apiStatus: normalizeStatus(stats.systemStatus.api),
  uptime: "Live",
  queue: stats.queueMetrics.total,
  avgTime: formatProcessingTime(stats.avgProcessingTimeMs),
  modules: [
    {
      name: "Database",
      status: normalizeStatus(stats.systemStatus.database) === "online" ? "healthy" as const : "error" as const,
    },
    {
      name: "Redis",
      status: normalizeStatus(stats.systemStatus.redis) === "online" ? "healthy" as const : "error" as const,
    },
    {
      name: "API",
      status: normalizeStatus(stats.systemStatus.api) === "online" ? "healthy" as const : "error" as const,
    },
  ],
});


export default function Page() {
  const { user } = useAuthStore();
  const shouldFetchDashboardStats = user?.role === "PROVIDER" || user?.role === "SUPER_ADMIN";
  const [caseStats, setCaseStats] = useState<CaseStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [aiUsageOverTime, setAiUsageOverTime] = useState<AiUsageOverTimeItem[]>([]);
  const [reportsOverTime, setReportsOverTime] = useState<ReportsOverTimeItem[]>([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [aiUsageError, setAiUsageError] = useState("");
  const [reportsError, setReportsError] = useState("");

  useEffect(() => {
    if (!shouldFetchDashboardStats) {
      setCaseStats(null);
      setStatsError("");
      return;
    }

    let isMounted = true;

    const loadCaseStats = async () => {
      setStatsLoading(true);
      setStatsError("");

      try {
        const response = await getCaseStats();

        if (isMounted) {
          setCaseStats(response);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setStatsError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadCaseStats();

    return () => {
      isMounted = false;
    };
  }, [shouldFetchDashboardStats]);

  useEffect(() => {
    if (!user) {
      setAiUsageOverTime([]);
      setReportsOverTime([]);
      setAiUsageError("");
      setReportsError("");
      return;
    }

    let isMounted = true;

    const loadChartData = async () => {
      setChartsLoading(true);
      setAiUsageError("");
      setReportsError("");

      const [aiUsageResult, reportsResult] = await Promise.allSettled([
        getAiUsageOverTime(),
        getReportsOverTime(),
      ]);

      if (!isMounted) {
        return;
      }

      if (aiUsageResult.status === "fulfilled") {
        setAiUsageOverTime(aiUsageResult.value);
      } else {
        setAiUsageOverTime([]);
        setAiUsageError(getErrorMessage(aiUsageResult.reason));
      }

      if (reportsResult.status === "fulfilled") {
        setReportsOverTime(reportsResult.value);
      } else {
        setReportsOverTime([]);
        setReportsError(getErrorMessage(reportsResult.reason));
      }

      setChartsLoading(false);
    };

    loadChartData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const statsData = useMemo(() => {
    if (shouldFetchDashboardStats) {
      if (caseStats) {
        return buildStatsData(caseStats);
      }

      return adminStatsData.map((item) => ({
        ...item,
        value: statsLoading ? "Loading..." : "0",
        stat: statsLoading ? "Syncing" : item.stat,
      }));
    }

    return adminStatsData;
  }, [caseStats, shouldFetchDashboardStats, statsLoading]);

  const systemHealth = caseStats ? buildSystemHealth(caseStats) : defaultSystemHealth;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <PageHeader
          title="System Overview"
          subtitle="Real-time clinical automation performance and health."
        />
      </div>

      {statsError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {statsError}
        </div>
      )}

      <StatsGrid data={statsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left top */}
        <div className="lg:col-span-2">
          <ReportsChartCard
            data={reportsOverTime}
            isLoading={chartsLoading}
            error={reportsError}
          />
        </div>

        {/* Right side spans 2 rows */}
        <div className="lg:row-span-2">
          <SystemHealthCard
            apiStatus={systemHealth.apiStatus}
            uptime={systemHealth.uptime}
            queue={systemHealth.queue}
            avgTime={systemHealth.avgTime}
            modules={systemHealth.modules}
          />
        </div>
        {/* Left bottom */}
        <div className="lg:col-span-2">
          <UsageChartCard
            data={aiUsageOverTime}
            isLoading={chartsLoading}
            error={aiUsageError}
          />
        </div>
      </div>

    </div>
  );
}
