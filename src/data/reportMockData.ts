import type { CaseReportResponse } from "@api/cases";

export const reportMockData: CaseReportResponse = {
  report: {
    sections: [
      {
        main_header: "",
        content: "",
        sub_sections: [
          {
            sub_header: "",
            content: "",
            source: "",
          },
        ],
      },
    ],
  },
  generatedAt: "",
  expiresAt: "",
  patientInfo: {
    name: "",
    dob: null,
    gender: "",
    date_of_injury: null,
    claim_number: "",
    employer: "",
  },
};