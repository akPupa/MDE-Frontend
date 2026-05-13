import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
} from "@react-pdf/renderer";

import {
    Document as DocxDocument,
    Packer,
    Paragraph,
    TextRun,
} from "docx";

import { saveAs } from "file-saver";

// ---------------- TYPES ----------------
export interface ReportSection {
    title: string;
    content: string;
    Source?: string;
    source?: string;
}

export interface PatientInfo {
    name: string;
    dob: string;
    gender: string | null;
    date_of_injury: string;
    claim_number: string | null;
    employer: string;
}

export interface ReportResponse {
    report: ReportSection[];
    patientInfo: PatientInfo;
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 12 },
    header: { fontSize: 18, marginBottom: 10 },
    section: { marginBottom: 12 },
    title: { fontSize: 14, fontWeight: "bold" },
});

// ---------------- PDF COMPONENT ----------------
const PDFDoc = ({ data }: { data: ReportResponse }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Medical Report</Text>

            <Text>Name: {data.patientInfo?.name}</Text>
            <Text>Claim: {data.patientInfo?.claim_number}</Text>

            {data.report.map((item, i) => (
                <View key={i} style={styles.section}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text>{item.content}</Text>
                    <Text>Source: {item.source}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

// ---------------- PDF EXPORT ----------------
export const generatePDF = async (data: ReportResponse) => {
    const blob = await pdf(<PDFDoc data={data} />).toBlob();
    saveAs(blob, "report.pdf");
};

// ---------------- DOCX EXPORT ----------------
export const generateDOCX = async (data: ReportResponse) => {
    const doc = new DocxDocument({
        sections: [
            {
                children: [
                    new Paragraph("Medical Report"),
                    new Paragraph(`Name: ${data.patientInfo.name}`),
                    new Paragraph(`Claim: ${data.patientInfo.claim_number}`),

                    ...data.report.flatMap((item) => [
                        new Paragraph({
                            children: [new TextRun({ text: item.title, bold: true })],
                        }),
                        new Paragraph(item.content),
                        new Paragraph(`Source: ${item.source}`),
                    ]),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "report.docx");
};