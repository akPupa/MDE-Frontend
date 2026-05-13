import {
    Document as DocxDocument,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { capitalizeFirst, toRoman } from "./stringUtils";
import type { ReportResponse } from "./pdfGenerator";

export const exportToDocx = async (data: ReportResponse): Promise<void> => {
    const safeName = data.patientInfo.name.replace(/\s+/g, "_");

    const now = new Date();
    const date = now.toLocaleDateString("en-CA");
    const time = now
        .toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        .replace(/:/g, "-");

    const timestamp = `${date}_${time}`;

    /* ================= HEADER ================= */

    const institution = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
                new TextRun({ text: data.institution.name, bold: true }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun(data.institution.address)],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun(`Phone: ${data.institution.phone}`)],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun(`Fax: ${data.institution.fax}`)],
        }),
    ];

    const title = new Paragraph({
        text: "MULTI-DISCIPLINARY EVALUATION",
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
    });

    /* ================= PATIENT INFO TABLE ================= */

    const patientTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    cell("Patient", data.patientInfo.name),
                    cell("Date of Injury", data.patientInfo.date_of_injury),
                ],
            }),
            new TableRow({
                children: [
                    cell("Date of Birth", data.patientInfo.dob),
                    cell("Work Status", data.patientInfo.work_status),
                ],
            }),
            new TableRow({
                children: [
                    cell(
                        "Age at Consult",
                        String(data.patientInfo.age_at_consult ?? "N/A")
                    ),
                    cell("Claim #", data.patientInfo.claim_number || "N/A"),
                ],
            }),
            new TableRow({
                children: [
                    cell(
                        "Gender",
                        capitalizeFirst(data.patientInfo.gender) || "N/A"
                    ),
                    cell("Employer", data.patientInfo.employer),
                ],
            }),
        ],
    });

    /* ================= REPORT SECTIONS ================= */

    const sections = data.report.flatMap((section, index) => {
        const children: Paragraph[] = [];

        children.push(
            new Paragraph({
                spacing: { before: 300, after: 100 },
                children: [
                    new TextRun({
                        text: `${toRoman(index + 1)}. ${section.main_header}`,
                        bold: true,
                        allCaps: true,
                    }),
                ],
            })
        );

        if (section.sub_sections && section.sub_sections.length > 0) {
            section.sub_sections.forEach((subSec) => {
                children.push(
                    new Paragraph({
                        spacing: { before: 150, after: 50 },
                        children: [
                            new TextRun({
                                text: subSec.sub_header,
                                bold: true,
                            }),
                        ],
                    })
                );

                children.push(
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [new TextRun(subSec.content)],
                    })
                );
            });
        } else {
            children.push(
                new Paragraph({
                    spacing: { after: 80 },
                    children: [new TextRun(section.content)],
                })
            );
        }

        return children;
    });

    /* ================= GUIDELINE ================= */

    const guideline = new Paragraph({
        spacing: { before: 300, after: 300 },
        children: [
            new TextRun({
                text: `Based on the findings of this multidisciplinary evaluation and the patient’s extensive treatment history, the patient meets all guideline-based criteria for participation in a Functional Restoration Program. Conservative treatments and surgical options have been exhausted without a return to full duty. The patient demonstrates ongoing functional limitations that prevent performance at the required job demand level. A Functional Restoration Program is medically necessary to address physical and psychosocial barriers to recovery and is required to advance the patient’s work status and progress toward functional independence. We are requesting authorization for a Functional Restoration Program in accordance with ACOEM/MTUS guidelines.`,
            }),
        ],
    });

    /* ================= DOCTOR SIGNATURES ================= */

    const doctorParagraphs = data.doctors.flatMap((doctor) => [
        // line
        new Paragraph({
            spacing: { before: 400 },
            children: [
                new TextRun("____________________________"),
            ],
        }),

        // name (NO gap)
        new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [
                new TextRun({
                    text: doctor,
                    bold: true,
                }),
            ],
        }),
    ]);

    /* ================= DOCUMENT ================= */

    const doc = new DocxDocument({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1200,
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                    },
                },
                children: [
                    ...institution,
                    title,
                    patientTable,
                    new Paragraph({ spacing: { after: 200 } }),
                    ...sections,
                    guideline,
                    ...doctorParagraphs,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, `${safeName}_Report_${timestamp}.docx`);
};

/* ================= HELPER ================= */

const cell = (label: string, value: string | null) =>
    new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: {
            bottom: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
            },
        },
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: `${label}: `, bold: true }),
                    new TextRun(value || "N/A"),
                ],
            }),
        ],
    });