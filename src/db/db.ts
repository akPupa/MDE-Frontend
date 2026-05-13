import { openDB, type DBSchema } from "idb";
import type { CaseReportResponse } from "@api/cases";
import type { Demographics } from "./types/patient";

export interface CaseRecord {
    caseId: string;
    demographics?: Demographics;
    report?: CaseReportResponse["report"];
    generatedAt?: string;
    expiresAt?: string;
}

interface CaseDB extends DBSchema {
    cases: {
        key: string; // caseId
        value: CaseRecord;
    };
}
export const dbPromise = openDB<CaseDB>("CaseDB", 2, {
    upgrade(db) {
        if (db.objectStoreNames.contains("cases")) {
            db.deleteObjectStore("cases");
        }

        db.createObjectStore("cases", { keyPath: "caseId" });
    },
});