import { FileText } from "lucide-react";

export const SectionHeader: React.FC<{ roman: string; title: string; source?: string }> = ({ roman, title, source }) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-12 mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
            <span className="text-primary font-bold tracking-widest text-sm">{roman}.</span>
            <h2 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wider">{title}</h2>
        </div>
        {source && (
            <div className="flex items-center gap-2 text-gray-400">
                <FileText size={14} />
                <span className="text-[11px] font-medium break-all">{source}</span>
            </div>
        )}
    </div>
);