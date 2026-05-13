import { getCaseReport, type CaseReportPatientInfo, type CaseReportResponse, type CaseReportSection, type CaseReportSubSection } from "@api/cases";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import { DetailItem } from "@components/ReportView/DetailItem";
import { SectionHeader } from "@components/ReportView/SectionHeader";
import { SubSectionHeader } from "@components/ReportView/SubSectionHeader";
import { capitalizeFirst, formatWithNewLines } from "@utils/stringUtils";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  reportMockData,
} from "../../data/reportMockData";
import { caseExists, getCase, saveCasePartial } from "src/db/caseService";
import { exportToPdf } from "@utils/pdfGenerator";
import { exportToDocx } from "@utils/docxGenerator";

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getPatientCaseLabel = (patientInfo: CaseReportPatientInfo) => {
  if (patientInfo.claim_number) return `Claim #${patientInfo.claim_number}`;
  return "Claim number unavailable";
};


export default function ReportView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<CaseReportResponse>(reportMockData);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  const getStorageKey = (caseId: string) => `case-report-${caseId}`;


  useEffect(() => {
    const getReportDetails = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        // 🔥 1. Check IndexedDB first
        const isExist = await caseExists(id)
        const cached = await getCase(id);

        if (cached?.report) {
          setData({
            ...reportMockData, // fallback base structure
            ...cached,
            report: cached.report,
            patientInfo: cached.demographics || {
              name: "Unknown",
              employer: "",
              dob: null,
              gender: "",
              date_of_injury: null,
              claim_number: "",
              work_status: "",
              age_at_consult: ""
            },
          });

          setLoading(false);
          return;
        }


        // ✅ 2. If not cached → fetch
        setLoading(true);
        setError("");

        const res = await getCaseReport(id);
        const formattedData: CaseReportResponse = {
          ...res,
          report: {
            ...res.report,
            sections: res.report.sections.map(section => ({
              ...section,
              content: formatWithNewLines(section.content),
              sub_sections: section.sub_sections.map(sub => ({
                ...sub,
                content: formatWithNewLines(sub.content),
              })),
            })),
          },
          patientInfo: cached?.demographics || {
            name: "Unknown",
            employer: "",
            dob: null,
            gender: "",
            date_of_injury: null,
            claim_number: "",
          },
        };

        setData(formattedData);
        await saveCasePartial({
          caseId: id,
          report: formattedData.report,
          generatedAt: res.generatedAt,
          expiresAt: res.expiresAt
        });

        // ✅ save only here
        // localStorage.setItem(storageKey, JSON.stringify(formattedData));

      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    getReportDetails();
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    if (!data?.report?.sections?.length) return;

    const timeout = setTimeout(() => {
      saveCasePartial({
        caseId: id,
        report: data.report,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [data.report, id]);

  // useEffect(() => {
  //   if (!id) return;
  //   if (!data?.report?.sections?.length) return;

  //   const storageKey = getStorageKey(id);

  //   const timeout = setTimeout(() => {
  //     localStorage.setItem(storageKey, JSON.stringify(data));
  //   }, 500); // save after 500ms pause

  //   return () => clearTimeout(timeout);
  // }, [data, id]);

  // useEffect(() => {
  //   const getReportDetails = async () => {
  //     try {
  //       if (!id) {
  //         navigate("/");
  //         return;
  //       }

  //       setLoading(true);
  //       setError("");
  //       const res = await getCaseReport(id);
  //       // setData({
  //       //   ...res,
  //       //   patientInfo: {
  //       //     name: "Unknown",
  //       //     employer: "",
  //       //     dob: null,
  //       //     gender: "",
  //       //     date_of_injury: null,
  //       //     claim_number: "",
  //       //   }
  //       // });

  //       setData({
  //         ...res,
  //         report: {
  //           ...res.report,
  //           sections: res.report.sections.map(section => ({
  //             ...section,
  //             content: formatWithNewLines(section.content), // ✅ also format main section
  //             sub_sections: section.sub_sections.map(sub => ({
  //               ...sub,
  //               content: formatWithNewLines(sub.content), // ✅ format once here
  //             })),
  //           })),
  //         },
  //         patientInfo: {
  //           name: "Unknown",
  //           employer: "",
  //           dob: null,
  //           gender: "",
  //           date_of_injury: null,
  //           claim_number: "",
  //         },
  //       });

  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err?.message || "Failed to fetch report");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getReportDetails();
  // }, [id, navigate]);

  const patient = data.patientInfo;

  interface Doctor {
    name: string;
    type: string;  // e.g., "Medical Doctor", "Psychologist", "Physical Therapist"
    source: string;
  }

  function extractUniqueDoctorNames(subSections: CaseReportSubSection[]): string[] {
    const doctorSet = new Set<string>();

    for (const section of subSections) {
      const doctorNames = section.content.split('\n').filter(name => name.trim());
      doctorNames.forEach(name => doctorSet.add(name.trim()));
    }

    return Array.from(doctorSet);
  }

  const handleDownloadReport = async (type: "pdf" | "docx") => {
    const payload = {
      report: data.report.sections,
      patientInfo: patient,
      institution: {
        name: "Compass Pain and Wellness",
        address: "1901 E. 4th St. Suite 210, Santa Ana, CA. 92705",
        phone: "(714) 542-5999",
        fax: "(714) 475-6991",
      },
      doctors: extractUniqueDoctorNames(data.report.sections[0].sub_sections)
    };

    const payloadToSend = {
      ...payload,
      patientInfo: {
        ...payload.patientInfo,
        employer: payload.patientInfo.employer ?? "",
        work_status: payload.patientInfo.work_status ?? "",
        age_at_consult: payload.patientInfo.age_at_consult ?? ""
      }
    };

    try {
      setDownloading(type);


      if (type === "docx") {
        await exportToDocx(payloadToSend);
      } else {
        await exportToPdf(payloadToSend);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  // Update main section content
  const handleSectionContentChange = (sectionIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      report: {
        ...prev.report,
        sections: prev.report.sections.map((sec, i) =>
          i === sectionIndex
            ? { ...sec, content: value }
            : sec
        ),
      },
    }));
  };

  // Update sub-section content
  const handleSubSectionContentChange = (
    sectionIndex: number,
    subIndex: number,
    value: string
  ) => {
    setData(prev => ({
      ...prev,
      report: {
        ...prev.report,
        sections: prev.report.sections.map((sec, i) =>
          i === sectionIndex
            ? {
              ...sec,
              sub_sections: sec.sub_sections.map((sub, j) =>
                j === subIndex
                  ? { ...sub, content: value }
                  : sub
              ),
            }
            : sec
        ),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-[900px] mx-auto pt-8 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[22px] font-black text-gray-900 tracking-tight mb-1">Report View</h1>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-primary">{patient.name}</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-400">{getPatientCaseLabel(patient)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton
              label="Download PDF"
              // icon={TbReportMedical}
              iconPosition="right"
              hollow
              loading={downloading == "pdf"}
              disabled={!!downloading}
              onClick={() => handleDownloadReport("pdf")}

            />
            <PrimaryButton
              label="Download DOCX"
              // icon={IoSparklesSharp}
              iconPosition="right"
              type="button"
              loading={downloading == "docx"}
              disabled={!!downloading}
              onClick={() => handleDownloadReport("docx")}

            />
          </div>
        </div>

        <div className="mt-12 mb-8 flex flex-col md:flex-row md:items-end justify-between border-b-[3px] border-primary/10 pb-6">
          <div>
            <h2 className="text-[34px] font-semibold text-gray-900 leading-tight mb-4 tracking-tighter">
              Clinical Assessment Report
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[1px] md:max-w-md">
              {patient.employer}
            </p>
          </div>
          <div className="text-left md:text-right mt-6 md:mt-0">
            <div className="flex flex-col md:items-end">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Generated: {formatDate(data.generatedAt)}
              </span>
              <span className="text-[11px] font-bold text-primary flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Expires: {formatDate(data.expiresAt)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-[13px] font-bold text-gray-400 shadow-sm">
            Loading report...
          </div>
        ) : (
          <>
            <SectionHeader roman="I" title="Patient Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label="Name" value={(patient.name)} />
              <DetailItem label="Date of birth" value={formatDate(patient.dob)} />
              <DetailItem label="Gender" value={capitalizeFirst(patient.gender)} />
              <DetailItem label="Date of injury" value={formatDate(patient.date_of_injury)} />
              <DetailItem label="Age at Consult" value={patient.age_at_consult} />
              <DetailItem label="Work Status" value={patient.work_status} />
              <DetailItem label="Claim number" value={patient.claim_number} />
              <DetailItem label="Employer" value={patient.employer} />
            </div>

            {data.report.sections.length > 0 ? (
              data.report.sections.map((section, index) => (
                <div key={`${section.main_header}-${index}`}>
                  <SectionHeader
                    roman={romanNumerals[index + 1] || `${index + 2}`}
                    title={section.main_header}
                  />
                  {section.sub_sections.length == 0 ? (<div className="bg-white">
                    <label className="flex flex-col gap-2">
                      <textarea
                        className="min-h-44 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] font-medium text-gray-700 leading-[1.8] outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 field-sizing-content resize-none"
                        value={section.content}
                        onChange={(event) => handleSectionContentChange(index, event.target.value)}
                      />
                    </label>
                  </div>)
                    : (
                      <>
                        {section.sub_sections.map((subSec, subIndex) => (
                          <>
                            <SubSectionHeader
                              roman={romanNumerals[index + 1] || `${index + 2}`}
                              title={subSec.sub_header}
                              source={subSec.source}
                            />
                            <div className="bg-white mb-6">
                              <label className="flex flex-col gap-2">
                                <textarea
                                  className="min-h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] font-medium text-gray-700 leading-[1.8] outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 field-sizing-content resize-none"
                                  value={subSec.content}
                                  onChange={(e) =>
                                    handleSubSectionContentChange(
                                      index,
                                      subIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              </label>
                            </div></>
                        ))}
                      </>
                    )}
                </div>
              ))
            ) : (
              <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-10 text-center text-[13px] font-bold text-gray-400 shadow-sm">
                No report sections available.
              </div>
            )}
          </>
        )}

        <div className="text-center py-12 border-t border-gray-100 flex flex-col items-center gap-3 mt-12">
          <div className="flex items-center gap-2 opacity-30 grayscale saturate-0 mb-4 scale-75">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black">M</div>
            <span className="font-black text-xl tracking-tighter text-gray-900">MDE AUTOMATION</span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium max-w-sm tracking-wide">
            Certified Clinical Assessment Record - Electronically Signed and Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
