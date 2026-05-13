import type {
    TableProps,
    TableCell,
    PillCell,
    ButtonCell,
    Align,
} from "./types";

export default function DynamicTable({ headers, rows, loading = false }: TableProps) {
    const pillColorMap: Record<string, string> = {
        red: "bg-red-100 text-red-600",
        yellow: "bg-yellow-100 text-yellow-700",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-600",
        teal: "bg-teal-100 text-teal-700",
    };

    const alignMap: Record<Align, string> = {
        left: "text-left",
        center: "text-center flex justify-center",
        right: "text-right flex justify-end",
    };

    const colCount = headers.length;

    const gridStyle = {
        gridTemplateColumns: `repeat(${colCount}, minmax(180px, 1fr))`,
    };

    return (
        <div className="w-full overflow-x-auto">
            {/* TABLE WRAPPER */}
            <div className="min-w-max">

                {/* HEADER */}
                <div
                    className="grid gap-3 px-6 py-4 border-b border-gray-100 items-center bg-gray-50"
                    style={gridStyle}
                >
                    {headers.map((h) => (
                        <div
                            key={h.key}
                            className={`${alignMap[h.align ?? "left"]} text-[11px] font-semibold uppercase tracking-widest text-gray-400 truncate`}
                        >
                            {h.label}
                        </div>
                    ))}
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="grid items-center justify-center h-40">
                        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ROWS */}
                        {rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`grid gap-3 px-6 py-4 items-center border-b border-gray-50 last:border-0 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                    }`}
                                style={gridStyle}
                            >
                                {headers.map((h) => {
                                    const cell = row[h.key] as TableCell;

                                    if (!cell) return <div key={h.key} />;

                                    const alignClass = alignMap[h.align ?? "left"];
                                    const type = cell.type ?? "text";

                                    return (
                                        <div key={h.key} className={`${alignClass} text-sm`}>
                                            {/* TEXT */}
                                            {type === "text" && cell.value}

                                            {/* LINK */}
                                            {type === "link" && (
                                                <span className="font-semibold text-[#029185]">
                                                    {cell.value}
                                                </span>
                                            )}

                                            {/* PILL */}
                                            {type === "pill" && (
                                                <span
                                                    className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide inline-block ${pillColorMap[(cell as PillCell).color ?? "blue"]
                                                        }`}
                                                >
                                                    {cell.value}
                                                </span>
                                            )}

                                            {/* BUTTON */}
                                            {type === "button" && (
                                                <button
                                                    onClick={(cell as ButtonCell).onClick}
                                                    className={`p-2 rounded-lg hover:bg-transition flex items-center gap-3 ${(cell as ButtonCell).className ?? ""
                                                        }`}
                                                >
                                                    {(cell as ButtonCell).element}
                                                    {cell.value}
                                                </button>
                                            )}

                                            {/* BUTTON */}
                                            {type === "element" && (
                                                <div
                                                    className={`p-2 rounded-lg hover:bg-transition flex items-center gap-3 ${(cell as ButtonCell).className ?? ""
                                                        }`}
                                                >
                                                    {(cell as ButtonCell).element}
                                                    {cell.value}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* EMPTY STATE */}
                        {!rows.length && (
                            <div className="h-40 grid justify-center items-center text-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}