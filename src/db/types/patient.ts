export type Demographics = {
    name: string;
    employer: string;
    dob: null;
    gender: string;
    date_of_injury: string | null;  // Remove undefined from the union
    claim_number: string;
    work_status: string;
    age_at_consult: string;
}

export interface PatientApiResponse {
    caseId: string;
    demographics: Demographics;
}

// This is what we store in IndexedDB
export interface PatientRecord extends Demographics {
    caseId: string;
}
