import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, PDFViewer } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { capitalizeFirst, toRoman } from './stringUtils';
import type { CaseReportSection } from '@api/cases';

// --- TYPES ---
export interface ReportSection {
    title: string;
    content: string;
    Source?: string;
    source?: string;
}

export interface PatientInfo {
    name: string;
    dob: string | null;
    gender: string | null;
    date_of_injury: string | null;
    claim_number: string | null;
    employer: string;
    work_status: string;
    age_at_consult: string
}

export interface InstitutionInfo {
    name: string;
    address: string;
    phone: string;
    fax: string;
}

export interface ReportResponse {
    institution: InstitutionInfo;
    report: CaseReportSection[];
    patientInfo: PatientInfo;
    doctors: string[]
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Times-Roman',
        color: '#333',
        paddingTop: 60
    },
    headerRight: { textAlign: 'right', marginBottom: 10, fontSize: 9, color: '#666' },
    instDetails: {
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 'auto'
    },
    instDetailsText: { marginBottom: 2, maxWidth: 160 },
    title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline', marginTop: 10, marginBottom: 10 },
    infoGrid: {
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20, columnGap: 30,
        borderBottom: '1px solid #000'
    },
    infoBox: { width: '45%', marginBottom: 6, },
    label: { fontWeight: 'bold' },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 15,
        textTransform: 'uppercase',
    },
    content: { marginTop: 6, textAlign: 'justify' },
    subSectionTitle: {
        fontSize: 11,
        fontWeight: 'semibold',
        marginTop: 10,
        textTransform: 'uppercase',
    },
    subContent: {
        marginTop: 4,
        textAlign: 'justify'
    },
    guideline: {
        marginTop: 20,
        marginBottom: 60,
        textAlign: 'justify',
        fontSize: 11,
        fontWeight: "semibold"
    },
    headerPageNumber: {
        position: 'absolute',
        top: 20,
        left: 40,
        fontSize: 9,
        color: '#666',
    },
});

const EvaluationDocument: React.FC<{ data: ReportResponse }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text
                style={[styles.headerPageNumber, {}]}
                render={({ pageNumber, totalPages }) => (
                    `Page ${pageNumber} of ${totalPages}`
                )}
                fixed
            />
            <View style={styles.instDetails}>
                <Text style={styles.instDetailsText}>{data.institution.name}</Text>
                <Text style={styles.instDetailsText}>{data.institution.address}</Text>
                <Text style={styles.instDetailsText}>Phone: {data.institution.phone}</Text>
                <Text style={styles.instDetailsText}>Fax: {data.institution.fax}</Text>
            </View>

            <Text style={styles.title}>MULTI-DISCIPLINARY EVALUATION</Text>

            <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Patient: </Text>
                        {data.patientInfo.name}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Date of Injury: </Text>
                        {data.patientInfo.date_of_injury}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Date of Birth: </Text>
                        {data.patientInfo.dob}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Work Status: </Text>
                        {data.patientInfo.work_status || 'N/A'}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Age at Consult: </Text>
                        {data.patientInfo.age_at_consult}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Claim #: </Text>
                        {data.patientInfo.claim_number || 'N/A'}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Gender: </Text>
                        {capitalizeFirst(data.patientInfo.gender) || 'N/A'}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text>
                        <Text style={styles.label}>Employer: </Text>
                        {data.patientInfo.employer}
                    </Text>
                </View>
            </View>

            {data.report.map((section, index) => (
                <View key={index} wrap={true}>
                    <Text style={styles.sectionTitle}>{toRoman(index + 1)}. {section.main_header}</Text>
                    {section.sub_sections.length <= 0
                        ? <Text style={styles.content}>{section.content}</Text>
                        :
                        <View style={{ marginTop: 5 }}>
                            {section.sub_sections.map((subSec, subIndex) => (
                                <>
                                    <Text style={styles.subSectionTitle}>{subSec.sub_header}</Text>
                                    <Text style={styles.subContent}>{subSec.content}</Text>
                                </>
                            ))}
                        </View>
                    }
                </View>
            ))}

            <Text style={styles.guideline}>
                Based on the findings of this multidisciplinary evaluation and the patient’s extensive treat-
                ment history, the patient meets all guideline
                -
                based criteria for participation
                in a Functional
                Restoration Program. Conservative treatments and surgical options have been exhausted
                without a return to full duty. The patient demonstrates ongoing functional limitations that
                prevent performance at the required job demand level. A Functi
                onal Restoration Program
                is medically necessary to address physical and psychosocial barriers to recovery and is re-
                quired
                to
                advance the patient’s work status and progress toward functional independence.
                We are requesting authorization for a Functional Res
                toration Program in accordance with
                ACOEM/MTUS guidelines.
            </Text>

            <View style={{ gap: 40 }}>
                {data.doctors.map(doctor => (
                    <View style={{
                        borderTop: '0.5px solid #000',
                        width: "33%",
                        paddingTop: 2,
                        fontSize: 12,
                        fontWeight: 'semibold',
                    }}>
                        <Text style={{}}>{doctor}</Text>
                    </View>
                ))}
            </View>

        </Page>
    </Document>
);

export const PdfPreview: React.FC<{ data: ReportResponse }> = ({ data }) => (
    <div style={{ width: '100%', height: '100vh' }}>
        <PDFViewer width="100%" height="100%" showToolbar={true}>
            <EvaluationDocument data={data} />
        </PDFViewer>
    </div>
);

export const exportToPdf = async (data: ReportResponse): Promise<void> => {
    const blob = await pdf(<EvaluationDocument data={data} />).toBlob();

    const safeName = data.patientInfo.name.replace(/\s+/g, "_");

    const now = new Date();
    const date = now.toLocaleDateString("en-CA");
    const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replace(/:/g, "-");

    const timestamp = `${date}_${time}`;

    saveAs(blob, `${safeName}_Report_${timestamp}.pdf`);
};