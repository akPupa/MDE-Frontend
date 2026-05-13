export const DetailItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div className="rounded-xl bg-gray-50 px-4 py-3 border border-gray-100">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
        <div className="text-[13px] font-bold text-gray-900">{value || "N/A"}</div>
    </div>
);