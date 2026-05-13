import { FileText } from "lucide-react";

export const SubSectionHeader: React.FC<{ roman: string; title: string; source?: string }> = ({ roman, title, source }) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 mb-4">
        <div className="flex items-center gap-3">
            {/* <span className="text-primary font-bold tracking-widest text-sm">{roman}.</span> */}
            <h3 className="text-[14px] font-semibold text-gray-900 uppercase tracking-wider">{title}</h3>
        </div>
        {source && (
            <div className="flex items-center gap-2 text-gray-400">
                <FileText size={14} />
                <span className="text-[11px] font-medium break-all">{source}</span>
            </div>
        )}
    </div>
);