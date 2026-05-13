import Modal from "@components/Common/Modal";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import { PageHeader } from "@components/MainLayout/PageHeader";
import Overview, { type DayData } from "@components/ReportLogs/Overview";
import ServerDynamicTable from "@components/Table/ServerDynamicTable";
import type {
  TableHeader,
  ServerTableProps,
  TableRow,
  Filter,
} from "@components/Table/types";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { getAllCases, getCaseReport, retryCaseReport } from "@api/cases";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";
import { useConfirmStore } from "@stores/confirmStore";
import { caseExists } from "src/db/caseService";

export default function Page() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role == "SUPER_ADMIN"
  const showConfirm = useConfirmStore((s) => s.show);


  /* HEADERS */
  const headers: TableHeader[] = [
    { key: "case_id", label: "Case ID", align: "left" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
  ];

  if (!isAdmin) {
    headers.push({ key: "action", label: "Action" });
  }

  /* FILTERS */
  const filters: Filter[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" },
        { label: "Processing", value: "processing" },
      ],
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

  /* OVERVIEW DATA */
  const weeklyData: DayData[] = [
    { day: "Mon", value: 75 },
    { day: "Tue", value: 50 },
    { day: "Wed", value: 90 },
    { day: "Thu", value: 65 },
    { day: "Fri", value: 85 },
    { day: "Sat", value: 40 },
    { day: "Sun", value: 70 },
  ];

  /* FETCH DATA FROM API */
  const fetchData: ServerTableProps["fetchData"] = async ({
    search,
    filters,
    page,
    pageSize,
  }) => {
    const res = await getAllCases({
      page, pageSize, search, startDate: filters.startDate as any, endDate: filters.endDate as any,
      status: filters.status as any,
    });

    const data = res.cases;
    const existenceMap = await Promise.all(
      data.map(async (item) => ({
        id: item._id,
        exists: await caseExists(item._id),
      }))
    );

    const existsLookup = new Map(
      existenceMap.map((e) => [e.id, e.exists])
    );


    const rows: TableRow[] = data.map((item) => {
      const exists = existsLookup.get(item._id);

      return {
        case_id: {
          type: "text",
          value: item._id,
        },
        status: {
          type: "pill",
          value: item.status,
          color:
            item.status === "completed"
              ? "green"
              : item.status === "failed"
                ? "red"
                : "yellow",
        },
        createdAt: {
          type: "text",
          value: format(new Date(item.createdAt), "hh:mm aa, MM/dd/yyyy"),
        },
        action: {
          type: "element",
          element: (
            <PrimaryButton
              label={
                item.isExpired
                  ? "Expired"
                  : !exists
                    ? "No access"
                    : item.status === "completed"
                      ? "View Report"
                      : item.status === "failed"
                        ? "Retry"
                        : item.status === "draft"
                          ? "Draft"
                          : ""
              }
              hollow
              variant="rounded"
              className="min-w-[130px]"
              loading={item.status === "processing"}
              disabled={item.status === "processing"
                || item.status === "draft"
                || item.isExpired
                || !exists
              }
              onClick={async () => {
                if (item.status === "completed") {
                  navigate(`/report-view/${item._id}`)
                }
                else if (item.status === "failed") {
                  showConfirm({
                    title: "Generate Report?",
                    message: "This will start generating the report for this case.",
                    confirmText: "Generate",
                    cancelText: "Cancel",
                    onConfirm: async () => {
                      try {
                        const res = await retryCaseReport(item._id)
                        showConfirm({
                          title: "Report Queued",
                          message: "Your report has been added to the processing queue. Track it in Report Logs.",
                          confirmText: "Go to Reports",
                          disableCancel: true,
                          onConfirm: () => {
                            navigate("/report-logs");
                          },
                        });
                      } catch (error) {

                      }

                    },
                  });

                }
                else {
                  return
                }

              }}
            />),
        }
      }
    });

    const total = res.pagination.total;

    return {
      rows: rows,
      total,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <PageHeader title="Report Logs" subtitle="Real-time audit trail..." />
        <PrimaryButton
          label="New Report"
          icon={Plus}
          onClick={() => navigate("/create-report")}
        />
      </div>

      <ServerDynamicTable
        headers={headers}
        filters={filters}
        searchPlaceholder="Search case ID..."
        defaultPageSize={10}
        fetchData={fetchData}
      />

      <Overview
        successRate={98.4}
        growthText="+1.2% from last week's clinical throughput."
        reportText="The automation engine has successfully processed cases with no critical latency detected."
        weeklyData={weeklyData}
      />
    </div>
  );
}