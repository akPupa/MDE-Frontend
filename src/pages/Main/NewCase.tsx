import { PageHeader } from "@components/MainLayout/PageHeader";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import InputFields from "@components/Common/InputFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  ClipboardCheck,
  User,
  Stethoscope,
  FileSearch,
  Send,
  Calendar,
  Layers,
  Clock
} from "lucide-react";
import { showToast } from "@utils/toast";

/* API FRIENDLY STATE STRUCTURE */
const initialValues = {
  // Section I: Patient
  patientName: "",
  patientId: "",
  dob: "",
  gender: "",
  // Section II: Clinical
  reasonForVisit: "",
  historyOfPresentIllness: "",
  // Section III: Diagnostic
  labResultsSummary: "",
  imagingFindings: "",
  // Section IV: Processing
  priority: "Standard",
  notes: ""
};

const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient Name is required"),
  patientId: Yup.string().required("Patient ID is required"),
  reasonForVisit: Yup.string().required("Clinical reason is required"),
});

const SectionHeading = ({ roman, title }: { roman: string; title: string }) => (
  <div className="flex items-center gap-3 mb-6 group">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-[14px] transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
      {roman}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-extrabold text-primary uppercase tracking-[2px]">Section {roman}</span>
      <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">{title}</h3>
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-100 to-transparent ml-4"></div>
  </div>
);

export default function NewCase() {
  const handleSubmit = (values: typeof initialValues) => {
    showToast("Case details saved to draft", "success");
  };

  return (
    <div className="flex flex-col gap-6 max-w-[850px] mx-auto py-8 px-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Create New Case"
          subtitle="Configure clinical parameters for automated record processing."
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </button>
          <PrimaryButton
            label="Save Draft"
            hollow
            onClick={() => showToast("Draft saved", "info")}
          />
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-8">

            {/* SECTION I */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-md">
              <SectionHeading roman="I" title="Patient Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputFields
                  name="patientName"
                  label="Patient Full Name"
                  placeholder="e.g. John Doe"
                  icon={User}
                />
                <InputFields
                  name="patientId"
                  label="Medical Record Number (MRN)"
                  placeholder="e.g. MDE-10293"
                  icon={ClipboardCheck}
                />
                <InputFields
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  icon={Calendar}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase">Gender</label>
                  <div className="flex gap-4 mt-1">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="gender" value={g} className="accent-primary w-4 h-4 cursor-pointer" />
                        <span className="text-[14px] font-medium text-gray-600 group-hover:text-primary transition-colors">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION II */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-md">
              <SectionHeading roman="II" title="Clinical Background" />
              <div className="flex flex-col gap-6">
                <InputFields
                  name="reasonForVisit"
                  label="Primary Complaint / Reason for Visit"
                  placeholder="Summarize the core reason for clinical attention..."
                  icon={Stethoscope}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase">History of Present Illness</label>
                  <textarea
                    name="historyOfPresentIllness"
                    className="w-full min-h-[120px] p-4 bg-gray-50 border border-transparent rounded-xl text-[14px] font-medium text-gray-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    placeholder="Provide a detailed clinical history..."
                  />
                </div>
              </div>
            </div>

            {/* SECTION III */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-md">
              <SectionHeading roman="III" title="Diagnostic Findings" />
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase">Laboratory Summary</label>
                    <textarea
                      name="labResultsSummary"
                      className="w-full min-h-[100px] p-4 bg-gray-50 border border-transparent rounded-xl text-[14px] font-medium text-gray-700 outline-none focus:bg-white focus:border-primary transition-all"
                      placeholder="Enter relevant lab values..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase">Imaging Interpretation</label>
                    <textarea
                      name="imagingFindings"
                      className="w-full min-h-[100px] p-4 bg-gray-50 border border-transparent rounded-xl text-[14px] font-medium text-gray-700 outline-none focus:bg-white focus:border-primary transition-all"
                      placeholder="Summarize X-ray, CT, or MRI findings..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION IV */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-md">
              <SectionHeading roman="IV" title="Processing & Finalization" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase flex items-center gap-2">
                      <Layers size={14} className="text-primary" />
                      Processing Priority
                    </label>
                    <select name="priority" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg text-[14px] font-bold text-gray-800 outline-none focus:bg-white focus:border-primary transition-all">
                      <option>Standard (1-2 min)</option>
                      <option>Urgent (Sub 30s)</option>
                      <option>Batch Processing</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-primary">AI Optimization Active</span>
                      <span className="text-[11px] text-teal-700 font-medium">Auto-populating relevant clinical tags</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase">Internal Dispatch Notes</label>
                  <textarea
                    name="notes"
                    className="w-full min-h-[120px] p-4 bg-gray-50 border border-transparent rounded-xl text-[14px] font-medium text-gray-700 outline-none focus:bg-white focus:border-primary transition-all"
                    placeholder="Add notes for the medical review team..."
                  />
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20 mb-8 mt-4">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">Ready for analysis?</span>
                <span className="text-[12px] text-gray-500 font-medium italic">Our clinical LLM will process these records immediately.</span>
              </div>
              <PrimaryButton
                label={isSubmitting ? "Processing..." : "Submit Case Analysis"}
                icon={Send}
                type="submit"
              />
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}
