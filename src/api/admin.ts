import { api } from "./client";

/* ================= TYPES ================= */

// Root document
export interface ReportTemplate {
    _id: string;
    name: string;
    master_prompt: string;
    template_content: TemplateContent;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Template content
export interface TemplateContent {
    template_name: string;
    sections: Section[];
}

// Sub-section
export interface SubSection {
    title: string;
    source: string;
}

// Strict Section type (recommended)
export type Section =
    | {
        main_header: string;
        source: string;
        sub_sections?: never;
    }
    | {
        main_header: string;
        sub_sections: SubSection[];
        source?: never;
    };

/* ================= API ================= */

// ✅ Get template
export const getTemplate = async (): Promise<ReportTemplate> => {
    try {
        const res = await api.get("/report-templates/getbyid/69ef521402b9e9480687ac17");
        return res.data;
    } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        throw new Error(
            message || "Failed to fetch template"
        );
    }
};
