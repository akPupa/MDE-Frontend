import { api } from "./client";

/* ================= TYPES ================= */
/* ================= REQUEST TYPES ================= */

export interface DocumentPayload {
    type: string;
    selected?: boolean;
    content: string;
}

export interface CreateCasePayload {
    documents: DocumentPayload[];
}

export interface GenerateReportPayload {
    caseId: string;
    patientInfo: CaseDemographics;
}

export interface GenerateReportResponse {
    jobId: string;
}

/* ================= RESPONSE TYPES ================= */

export interface CaseDemographics {
    name: string;
    dob: string;
    gender: string;
    date_of_injury: string;
    claim_number: string;
    employer: string;
    age_at_consult: string;
    work_status: string;
}

export interface CreateCaseResponse {
    caseId: string;
    demographics: CaseDemographics;
}

export interface CaseItem {
    _id: string;
    status: "completed" | "failed" | "processing" | string;
    createdAt: string;
    isExpired: boolean;
}

export interface CasesPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetCasesResponse {
    cases: CaseItem[];
    pagination: CasesPagination;
}

export interface CaseStatsResponse {
    totalReports: number;
    activeCases: number;
    failedGenerations: number;
    totalTokens: number;
    aiUsageCount: number;
    queueMetrics: {
        waiting: number;
        active: number;
        delayed: number;
        total: number;
    };
    avgProcessingTimeMs: number;
    systemStatus: {
        database: "online" | "offline" | string;
        redis: "online" | "offline" | string;
        api: "online" | "offline" | string;
    };
}

export interface AiUsageOverTimeItem {
    date: string;
    totalTokens: number;
}

export interface ReportsOverTimeItem {
    date: string;
    count: number;
}

type ApiError = {
    response?: {
        data?: {
            message?: string;
        };
    };
};

type CaseListApiItem = {
    _id: string;
    status: string;
    createdAt: string;
    isExpired: boolean;
};

const getApiErrorMessage = (err: unknown, fallback: string) => {
    const message = (err as ApiError)?.response?.data?.message;
    return message || fallback;
};

export interface getCasesParams {
    page?: number;
    pageSize?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: any
}

/* ================= CASE REPORT TYPES (SAFE PREFIXED) ================= */

export interface CaseReportSubSection {
    sub_header: string;
    content: string;
    source?: string;
}

export interface CaseReportSection {
    main_header: string;
    content: string;
    sub_sections: CaseReportSubSection[];
}

export interface CaseReportData {
    sections: CaseReportSection[];
}

export interface CaseReportPatientInfo {
    name: string;
    employer?: string;
    dob: string | null;
    gender: string;
    date_of_injury: string | null;
    claim_number: string;
    age_at_consult?: string;
    work_status?: string;
}

export interface CaseReportResponse {
    report: CaseReportData;
    generatedAt: string;
    expiresAt: string;
    patientInfo: CaseReportPatientInfo;
}
/* ================= API ================= */

export const createCase = async (
    data: CreateCasePayload
): Promise<CreateCaseResponse> => {
    try {
        const res = await api.post("/cases/create", data);
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to create case")
        );
    }
};

export const generateReport = async (
    data: GenerateReportPayload
): Promise<GenerateReportResponse> => {
    try {
        const res = await api.post("/cases/generate-report", data);
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to generate report")
        );
    }
};

export const getAllCases = async (
    params?: getCasesParams
): Promise<GetCasesResponse> => {
    try {
        const res = await api.get("/cases/getallcase", {
            params,
        });
        return {
            cases: res.data.cases.map((c: CaseListApiItem) => ({
                _id: c._id,
                status: c.status,
                createdAt: c.createdAt,
                isExpired: c.isExpired,
            })),
            pagination: res.data.pagination,
        };
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch cases")
        );
    }
};

export const getCaseStats = async (): Promise<CaseStatsResponse> => {
    try {
        const res = await api.get("/cases/stats");
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch dashboard stats")
        );
    }
};

export const getAiUsageOverTime = async (): Promise<AiUsageOverTimeItem[]> => {
    try {
        const res = await api.get("/cases/ai-usage-over-time");
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch AI usage over time")
        );
    }
};

export const getReportsOverTime = async (): Promise<ReportsOverTimeItem[]> => {
    try {
        const res = await api.get("/cases/reports-over-time");
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch reports over time")
        );
    }
};

/* ✅ TYPED VERSION */
export const getCaseReport = async (
    caseId: string
): Promise<CaseReportResponse> => {
    try {
        const res = await api.get(`/cases/report/${caseId}`);
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch report")
        );
    }
};

export const retryCaseReport = async (caseId: string) => {
    try {
        const res = await api.post(`/cases/retry/${caseId}`);
        return res.data;
    } catch (err: unknown) {
        throw new Error(
            getApiErrorMessage(err, "Failed to fetch report")
        );
    }
};
