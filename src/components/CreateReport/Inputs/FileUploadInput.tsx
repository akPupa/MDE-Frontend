import React, { useRef, useState } from "react";
import { type IconType } from "react-icons";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";

type FileUploadInputProps = {
    label: string;
    icon?: IconType;
    limit?: number;
    value?: File[]; // ✅ controlled value
    onChange?: (files: File[]) => void;
    error?: string; // ✅ from Formik
    loading: boolean
};

const FileUploadInput = ({
    label,
    icon: Icon,
    limit = 1,
    value = [],
    onChange,
    error,
    loading
}: FileUploadInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>(value);
    const disabeld = files.length >= limit || loading;
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        const validFiles = selectedFiles.filter((file) =>
            [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type)
        );

        // ❌ limit validation → send empty update (Formik will handle error)
        if (files.length + validFiles.length > limit) {
            return;
        }

        const updated = [...files, ...validFiles];
        setFiles(updated);
        onChange?.(updated);
    };

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onChange?.(updated);
    };

    return (
        <div
            className={`flex flex-col gap-3 p-4 rounded-xl border border-dashed 
            ${error ? "border-red-500 bg-red-50" : "border-primary bg-slate-50"}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={18} className="text-primary" />}
                    <p className="text-xs font-bold uppercase">{label}</p>
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabeld}
                    className={`text-xs text-primary font-semibold border rounded-md py-1.5 px-2 flex gap-1
                        ${disabeld
                            ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-primary"
                            : "hover:bg-primary hover:text-white"
                        }`}
                >
                    <LuPlus size={14} />
                    ADD FILE
                </button>
            </div>

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                multiple={limit > 1}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleUpload}
            />

            {/* Empty State */}
            {files.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                    No files uploaded
                </p>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-3 bg-primary/10 px-3 py-2 rounded-lg`}

                        >
                            <span className="text-sm text-primary">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                disabled={loading}
                                className={`${loading ? "cursor-not-allowed" : ""}`}
                            >
                                <IoClose size={18} className="text-gray-400" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center">
                {/* Error from Formik */}
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )
                }
                <span
                    className={`ml-auto text-[10px] font-semibold px-4 py-1 rounded-full tracking-wide bg-primary/10 text-primary
                        }`}
                >
                    {files.length}/{limit}
                </span>            </div >

        </div >
    );
};

export default FileUploadInput;