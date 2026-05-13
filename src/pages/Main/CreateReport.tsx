import { PrimaryButton } from "@components/Common/PrimaryButton";
import PatientDetails from "@components/CreateReport/PatientDetails";
import UploadDocuments from "@components/CreateReport/UploadDocuments";
import { PageHeader } from "@components/MainLayout/PageHeader";
import { useConfirmStore } from "@stores/confirmStore";
import { showToast } from "@utils/toast";
import { IoSparklesSharp } from "react-icons/io5";
import { TbReportMedical } from "react-icons/tb";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCase, generateReport, type CreateCaseResponse, type DocumentPayload } from "@api/cases";
import { saveCasePartial } from "src/db/caseService";

export default function Page() {
    const navigate = useNavigate();
    const showConfirm = useConfirmStore((s) => s.show);
    const [extractedDocs, setExtractedDocs] = useState<any>(null);
    const [caseDetails, setCaseDetails] = useState<CreateCaseResponse | null>(null);
    const [caseCreateLoading, setCaseCreateLoading] = useState<boolean>(false);
    const [generateReportLoading, setGenerateReportLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            medical: [] as File[],
            psych: [] as File[],
            pt: [] as File[],
        },

        validationSchema: Yup.object({
            medical: Yup.array().min(1, "Medical Summary is required"),
            psych: Yup.array().min(1, "Psych Report is required"),
            pt: Yup.array().min(1, "PT Report is required"),
        }),

        validateOnChange: false, // ✅ disable onChange validation
        validateOnBlur: false,   // ✅ disable onBlur validation

        onSubmit: () => {
            showConfirm({
                title: "Create Case?",
                message: "This will upload and process the selected documents.",
                confirmText: "Create",
                cancelText: "Cancel",
                onConfirm: () => {
                    createNewCase();
                },
            });
        }
    });

    const countPatientFields = (content: string) => {
        const checks = [
            /regarding:/i,          // name
            /date of birth:/i,      // DOB
            /date of injury:/i,     // DOI
            /claim number:/i,       // claim
            /employer:/i,           // employer
        ];

        let count = 0;

        checks.forEach((regex) => {
            if (regex.test(content)) count++;
        });

        return count;
    };

    const shouldSelectMD = (content: string) => {
        return countPatientFields(content) >= 2;
    };

    const prepareDocuments = (docs: DocumentPayload[]) => {
        return docs.map((doc) => {
            return {
                ...doc,
                selected: shouldSelectMD(doc.content),
            };
            return doc;
        });
    };

    const createNewCase = async () => {
        if (!extractedDocs?.documents) {
            showToast("No documents found");
            return;
        }

        const preparedDocs = prepareDocuments(extractedDocs.documents);

        const payload = {
            documents: preparedDocs
        };


        setCaseCreateLoading(true);

        try {
            const res = await createCase(payload);
            setCaseDetails(res);
            await saveCasePartial({
                caseId: res.caseId,
                demographics: res.demographics,
            });
            // const patient = await getPatient(data.caseId);

        } catch (err: any) {
            showToast(err.message || "Failed to create case", "error");
        } finally {
            setCaseCreateLoading(false); // ✅ ALWAYS runs
        }
    };
    const updateField = (field: "medical" | "psych" | "pt", value: File[]) => {
        formik.setFieldValue(field, value);

        if (value.length > 0) {
            formik.setFieldError(field, undefined);
        }
    };

    const generateSubmit = () => {
        showConfirm({
            title: "Generate Report?",
            message: "This will start generating the report for this case.",
            confirmText: "Generate",
            cancelText: "Cancel",
            onConfirm: () => {
                handleGenerateReport();
            },
        });
    };

    const handleGenerateReport = async () => {
        if (!caseDetails) {
            showToast("Create case first", "error");
            return;
        }
        setGenerateReportLoading(true)
        const reportRes = await generateReport({
            caseId: caseDetails.caseId,
            patientInfo: caseDetails.demographics
        });
        setGenerateReportLoading(false)
        // showToast("Report generated sucessfully!")
        // navigate("/report-logs")
        showConfirm({
            title: "Report Queued",
            message: "Your report has been added to the processing queue. Track it in Report Logs.",
            confirmText: "Go to Reports",
            disableCancel: true,
            onConfirm: () => {
                navigate("/report-logs");
            },
        });

    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between items-center mb-4">
                <PageHeader title="Create Report" />

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        label="Create Case"
                        icon={TbReportMedical}
                        iconPosition="right"
                        hollow
                        type="submit"
                        loading={caseCreateLoading}
                        disabled={generateReportLoading}
                    />
                    <PrimaryButton
                        label="Generate Report"
                        icon={IoSparklesSharp}
                        iconPosition="right"
                        onClick={generateSubmit}
                        type="button"
                        loading={generateReportLoading}
                        disabled={caseCreateLoading || !caseDetails}
                    />
                </div>
            </div>

            <div className="grid grid-cols-5 items-start gap-4">
                <UploadDocuments
                    onChange={(data) => {
                        updateField("medical", data.medical);
                        updateField("psych", data.psych);
                        updateField("pt", data.pt);
                    }}
                    onExtract={(data) => {
                        setExtractedDocs(data);
                        alert("test")
                        console.log({ data });

                    }}
                    errors={{
                        medical:
                            typeof formik.errors.medical === "string"
                                ? formik.errors.medical
                                : undefined,
                        psych:
                            typeof formik.errors.psych === "string"
                                ? formik.errors.psych
                                : undefined,
                        pt:
                            typeof formik.errors.pt === "string"
                                ? formik.errors.pt
                                : undefined,
                    }}
                    loading={caseCreateLoading || generateReportLoading}
                />
                <PatientDetails details={caseDetails} />
            </div>
        </form>
    );
}