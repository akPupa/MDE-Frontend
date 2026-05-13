import { useEffect, useState } from "react";
import { PageHeader } from "@components/MainLayout/PageHeader";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import InputError from "@components/ErrorAlert/InputError";
import {
  Plus,
  FileText,
  MoreVertical,
  Folder,
  Bot,
  GripVertical,
  Copy,
  Trash2,
  Brain,
  UserRoundSearch,
  Check,
  X,
  Edit2,
  type LucideIcon,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { showToast } from "@utils/toast";
import { useAuthStore } from "@stores/authStore";
import { getTemplate, type Section } from "@api/admin";

type TemplateDocument = {
  id: number;
  name: string;
  icon: LucideIcon;
  limit: number;
};

const initialDocuments: TemplateDocument[] = [
  { id: 1, name: "Medical Summary", icon: FileText, limit: 5 },
  { id: 2, name: "Psych Report", icon: Brain, limit: 3 },
  { id: 3, name: "PT Report", icon: UserRoundSearch, limit: 10 },
];

const initialSections = [
  {
    id: "section-1",
    header: "CLINICAL TEAM",
    subheader: "Attending Clinicians & Specialists",
  },
  {
    id: "section-2",
    header: "RECORDS REVIEWED",
    subheader: "Chronological Inventory",
    isAutosaved: true,
  },
  {
    id: "section-3",
    header: "MEDICAL EVALUATION",
    subheader: "Physical Findings & Diagnostics",
  },
  {
    id: "section-4",
    header: "PSYCHOSOCIAL EVALUATION",
    subheader: "Behavioral Health Assessment",
  },
];

const defaultMasterPrompt = "You are a clinical documentation specialist. Generate professional, medical-grade summaries based on provided clinician notes. Maintain a objective tone and prioritize ICD-10 relevant data. Ensure all sections strictly adhere to HIPAA compliance protocols.";

// Helper to convert index to Roman numerals
const toRoman = (num: number) => {
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return roman[num] || (num + 1).toString();
};

interface SortableItemProps {
  section: Section;
  index: number;
  isDev: boolean;
}

function SortableSection({ section, index, isDev }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.main_header });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border-l-[3px] border-primary shadow-sm overflow-hidden border border-gray-100 transition-shadow ${isDragging ? 'shadow-2xl ring-2 ring-primary/20' : ''}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-4">
          {isDev && (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded-md transition-colors text-gray-300 hover:text-gray-500">
              <GripVertical size={18} />
            </div>
          )}
          <span className="px-2.5 py-1 bg-teal-50 text-primary text-[10px] font-extrabold rounded tracking-[0.5px]">
            SECTION {toRoman(index)}
          </span>
          {/* {section.isAutosaved && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 ml-4">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[11px] font-bold text-green-700">Autosaved just now</span>
            </div>
          )} */}
        </div>
        {isDev && (
          <div className="flex items-center gap-4 text-gray-400">
            <Copy size={17} className="cursor-pointer hover:text-primary transition-colors" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.5px] uppercase">Section Header</label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg text-[14px] font-bold text-gray-800">
              {section.main_header}
            </div>
          </div>
          {section.sub_sections && <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.5px] uppercase">Subheaders</label>
            <div className="flex flex-col gap-2">
              {section.sub_sections?.map((i) => (
                <div className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg text-[14px] font-medium text-gray-700">
                  {i.title}
                </div>
              ))}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default function TemplateEditor() {
  const { user } = useAuthStore();
  const isDev = user?.role === 'DEV';
  const canEditMasterPrompt = user?.email === 'dev@gmail.com';

  const [showAddNew, setShowAddNew] = useState(false);
  const [docs, setDocs] = useState(initialDocuments);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [sectionsState, setSectionsState] = useState(initialSections);
  const [masterPrompt, setMasterPrompt] = useState(defaultMasterPrompt);
  const [sections, setSections] = useState<Section[] | null>(null)

  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(masterPrompt);

  const handleMasterPromptChange = (val: string) => {
    setTempPrompt(val);
  };

  const handleEditPrompt = () => {
    setTempPrompt(masterPrompt);
    setIsEditingPrompt(true);
  };

  const handleCancelPrompt = () => {
    setTempPrompt(masterPrompt);
    setIsEditingPrompt(false);
  };

  const handleSavePrompt = () => {
    setMasterPrompt(tempPrompt);
    setIsEditingPrompt(false);
    showToast("Master prompt updated", "success");
  };

  const handleSaveTemplate = () => {
    showToast("Template layout saved", "success");
  };

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionsState((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      showToast("Section order updated", "success");
    }
  };

  // Form states for Add New
  const [newName, setNewName] = useState("");
  const [newLimit, setNewLimit] = useState("1");
  const [addErrors, setAddErrors] = useState<{ name?: string, limit?: string }>({});

  // Form states for Inline Edit
  const [editName, setEditName] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [editErrors, setEditErrors] = useState<{ name?: string, limit?: string }>({});

  const validateAdd = () => {
    const newErrors: { name?: string, limit?: string } = {};
    if (!newName) newErrors.name = "Document name is required";
    if (!newLimit) newErrors.limit = "Limit is required";
    else if (parseInt(newLimit) <= 0) newErrors.limit = "Limit must be a positive number";

    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = () => {
    if (validateAdd()) {
      const newDoc = {
        id: Date.now(),
        name: newName,
        icon: FileText,
        limit: parseInt(newLimit)
      };
      setDocs([...docs, newDoc]);
      setNewName("");
      setNewLimit("1");
      setShowAddNew(false);
      showToast("Document added successfully", "success");
    }
  };

  const startEditing = (doc: TemplateDocument) => {
    setEditingId(doc.id);
    setEditName(doc.name);
    setEditLimit(doc.limit.toString());
    setActiveMenuId(null);
    setEditErrors({});
  };

  const validateEdit = () => {
    const newErrors: { name?: string, limit?: string } = {};
    if (!editName) newErrors.name = "Document name is required";
    if (!editLimit) newErrors.limit = "Limit is required";
    else if (parseInt(editLimit) <= 0) newErrors.limit = "Limit must be a positive number";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEdit = (id: number) => {
    if (validateEdit()) {
      setDocs(docs.map(d => d.id === id ? { ...d, name: editName, limit: parseInt(editLimit) } : d));
      setEditingId(null);
      showToast("Document updated", "success");
    }
  };

  useEffect(() => {
    const getTemplateData = async () => {
      const res = await getTemplate();

      setMasterPrompt(res.master_prompt || defaultMasterPrompt);
      setTempPrompt(res.master_prompt || defaultMasterPrompt);
      setSections(res.template_content.sections);
    };

    getTemplateData();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <PageHeader
          title="Template Editor"
          subtitle="Comprehensive Automation Configuration (APPX A)"

        />
        {isDev && (
          <div className="flex items-center gap-3">
            {/* <PrimaryButton 
              label="Discard Changes" 
              hollow 
              className="border-gray-300 text-gray-700 hover:bg-gray-50" 
              onClick={() => showToast("Changes discarded", "info")}
            /> */}
            <PrimaryButton
              label="Save Template"
              onClick={handleSaveTemplate}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Stats & Docs) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Expected Documents Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-primary">
                  <Folder size={20} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">Expected Documents</h3>
                </div>
              </div>
              {isDev && (
                <button
                  onClick={() => {
                    setShowAddNew(!showAddNew);
                    setAddErrors({});
                  }}
                  className="flex items-center gap-1.5 text-[13px] font-bold text-primary hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
                >
                  <Plus size={16} />
                  Add New
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {docs.map((doc) => (
                <div key={doc.id} className="relative">
                  {editingId === doc.id ? (
                    // Inline Edit UI
                    <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex flex-col gap-1">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Document Name"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-[13px] font-semibold text-gray-800 outline-none focus:border-primary"
                        />
                        <InputError message={editErrors.name} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          min="1"
                          value={editLimit}
                          onChange={(e) => setEditLimit(e.target.value)}
                          placeholder="Limit"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-[13px] font-semibold text-gray-800 outline-none focus:border-primary"
                        />
                        <InputError message={editErrors.limit} />
                      </div>
                      <div className="flex justify-end gap-2 mt-1">
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button>
                        <button onClick={() => saveEdit(doc.id)} className="p-1.5 text-primary hover:opacity-80">
                          <Check size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Standard Row UI
                    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <doc.icon size={18} className="text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-gray-700">{doc.name}</span>
                          <span className="text-[11px] text-gray-500 font-medium">Max Limit: {doc.limit}</span>
                        </div>
                      </div>
                      {isDev && (
                        <div className="relative">
                          <MoreVertical
                            size={25}
                            className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                            onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                          />
                          {activeMenuId === doc.id && (
                            <div className="absolute right-0 top-7 z-10 bg-white border border-gray-100 shadow-xl rounded-lg p-1 min-w-[100px] animate-[fadeIn_0.1s_ease-out]">
                              <button
                                onClick={() => startEditing(doc)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 rounded-md"
                              >
                                <Edit2 size={14} className="text-primary" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDocs(docs.filter(d => d.id !== doc.id));
                                  setActiveMenuId(null);
                                  showToast("Document deleted", "info");
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Document Panel */}
              {isDev && showAddNew && (
                <div className="mt-2 p-5 border border-primary/20 rounded-xl bg-primary/5 flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-primary tracking-tight uppercase">Document Name</label>
                      <input
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value);
                          if (addErrors.name) setAddErrors({ ...addErrors, name: undefined });
                        }}
                        placeholder="e.g. Radiology Report"
                        className="w-full px-3 py-2 bg-white border border-primary/20 rounded-lg text-[13px] font-semibold text-gray-800 outline-none focus:border-primary transition-all"
                      />
                      <InputError message={addErrors.name} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-primary tracking-tight uppercase">Document Limit</label>
                      <input
                        type="number"
                        min="1"
                        value={newLimit}
                        onChange={(e) => {
                          setNewLimit(e.target.value);
                          if (addErrors.limit) setAddErrors({ ...addErrors, limit: undefined });
                        }}
                        placeholder="Max Limit"
                        className="w-full px-3 py-2 bg-white border border-primary/20 rounded-lg text-[13px] font-semibold text-gray-800 outline-none focus:border-primary transition-all"
                      />
                      <InputError message={addErrors.limit} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowAddNew(false)}
                      className="px-4 py-2 text-[12px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddDocument}
                      className="px-4 py-2 bg-primary text-white text-[12px] font-bold rounded-lg hover:brightness-95 transition-all"
                    >
                      Add Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Right Column (Editor) */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Master Prompt Card */}
          <div className={`bg-white rounded-xl border ${isEditingPrompt ? 'border-primary ring-1 ring-primary/10 shadow-md' : 'border-gray-100 shadow-sm'} transition-all p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${isEditingPrompt ? 'bg-primary/10 text-primary' : 'bg-teal-50 text-primary'} flex items-center justify-center transition-colors`}>
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Master Prompt</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Global instructions for clinical AI engine</p>
                </div>
              </div>
              {canEditMasterPrompt && !isEditingPrompt && (
                <button
                  onClick={handleEditPrompt}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  title="Edit Master Prompt"
                >
                  <Edit2 size={18} />
                </button>
              )}
            </div>

            <div className={`rounded-xl p-0 overflow-hidden border transition-all ${isEditingPrompt ? 'bg-white border-primary/20' : 'bg-gray-50 border-gray-100'}`}>
              <textarea
                value={isEditingPrompt ? tempPrompt : masterPrompt}
                onChange={(e) => handleMasterPromptChange(e.target.value)}
                readOnly={!isEditingPrompt}
                rows={10}
                className={`min-h-[260px] w-full px-5 py-4 bg-transparent text-[14px] text-gray-700 leading-relaxed font-medium outline-none resize-y ${!isEditingPrompt ? 'cursor-default resize-none' : ''}`}
                placeholder="Enter clinical instructions..."
              />
            </div>

            {isEditingPrompt && (
              <div className="flex justify-end gap-3 mt-4 animate-[fadeIn_0.2s_ease-out]">
                <button
                  onClick={handleCancelPrompt}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSavePrompt}
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:brightness-95 transition-all shadow-sm"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Report Sections Header */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Report Sections</h2>
            {isDev && (
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-primary text-[13px] font-bold rounded-lg hover:bg-gray-200 transition-colors ">
                <Plus size={16} />
                Add New Section
              </button>
            )}
          </div>

          {/* Section List with Sortable Context */}
          <div className="flex flex-col gap-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionsState.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections && sections.map((section, index) => (
                  <SortableSection key={section.main_header} section={section} index={index} isDev={isDev} />
                ))}
              </SortableContext>
            </DndContext>
          </div>

        </div>
      </div>
    </div>
  );
}
