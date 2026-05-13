import { dbPromise } from "./db";

export async function saveCasePartial(data: {
    caseId: string;
    demographics?: any;
    report?: any;
    generatedAt?: string;
    expiresAt?: string;
}) {
    const db = await dbPromise;

    const existing = await db.get("cases", data.caseId);

    const updated = {
        ...existing,
        ...data,
        caseId: data.caseId,
    };

    await db.put("cases", updated);
}

export async function getCase(caseId: string) {
    const db = await dbPromise;
    return db.get("cases", caseId);
}

export async function caseExists(caseId: string): Promise<boolean> {
    const db = await dbPromise;
    const key = await db.getKey("cases", caseId);
    return key !== undefined;
}