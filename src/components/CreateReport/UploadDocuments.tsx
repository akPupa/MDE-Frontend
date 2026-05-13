import React, { useState } from "react";
import Heading from "./Heading";
import { MdCloudUpload } from "react-icons/md";
import FileUploadInput from "./Inputs/FileUploadInput";
import { FaFileMedical, FaBrain, FaDumbbell } from "react-icons/fa";
import { extractFileText } from "@utils/fileExtractor";

type UploadDocumentsProps = {
    onChange: (data: {
        medical: File[];
        psych: File[];
        pt: File[];
    }) => void;

    onExtract?: (data: {
        documents: {
            name: string;
            type: "MD" | "Psych" | "PT";
            content: string;
        }[];
    }) => void;

    errors?: {
        medical?: string;
        psych?: string;
        pt?: string;
    };

    loading: boolean
};

function UploadDocuments({ onChange, onExtract, errors, loading }: UploadDocumentsProps) {
    const [files, setFiles] = useState({
        medical: [] as File[],
        psych: [] as File[],
        pt: [] as File[],
    });

    const typeMap = {
        medical: "MD",
        psych: "Psych",
        pt: "PT",
    } as const;

    const updateFiles = async (key: keyof typeof files, value: File[]) => {
        const updated = { ...files, [key]: value };
        setFiles(updated);

        // keep Formik flow unchanged
        onChange(updated);

        // 🔥 extract text + build final structure
        const docs = await Promise.all(
            Object.entries(updated).flatMap(async ([k, fileList]) => {
                return Promise.all(
                    fileList.map(async (file) => ({
                        name: file.name,
                        type: typeMap[k as keyof typeof typeMap],
                        content: await extractFileText(file),
                    }))
                );
            })
        );

        onExtract?.({
            documents: docs.flat(),
        });
    };

    return (
        <div className="grid col-span-2 p-3 gap-4 border rounded-lg border-border shadow">
            <Heading title="Upload Documents" icon={MdCloudUpload} />

            <FileUploadInput
                label="Medical Summary"
                icon={FaFileMedical}
                limit={10}
                value={files.medical}
                onChange={(f) => updateFiles("medical", f)}
                error={errors?.medical}
                loading={loading}
            />

            <FileUploadInput
                label="Psych Report"
                icon={FaBrain}
                limit={1}
                value={files.psych}
                onChange={(f) => updateFiles("psych", f)}
                error={errors?.psych}
                loading={loading}
            />

            <FileUploadInput
                label="PT Report"
                icon={FaDumbbell}
                limit={1}
                value={files.pt}
                onChange={(f) => updateFiles("pt", f)}
                error={errors?.pt}
                loading={loading}
            />
        </div>
    );
}

export default UploadDocuments;