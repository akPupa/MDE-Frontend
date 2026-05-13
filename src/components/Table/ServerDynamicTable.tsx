import { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable";
import type { ServerTableProps, TableRow, FilterValue } from "./types";
import { PrimaryButton } from "@components/Common/PrimaryButton";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import FilterDate from "./FilterDate";
import { IoClose } from "react-icons/io5";

export default function ServerDynamicTable({
  headers,
  searchPlaceholder = "Search...",
  filters = [],
  defaultPageSize = 10,
  fetchData,
  actionButton,
  title = "",
}: ServerTableProps) {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<
    Record<string, FilterValue>
  >({});
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = defaultPageSize;

  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await fetchData({
        search,
        filters: activeFilters,
        page,
        pageSize,
      });
      setRows(res.rows);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, activeFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* ✅ FIXED */
  const handleFilterChange = (key: string, value: FilterValue) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleDateChange = (key: string, date: Date | null) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: date ? date.toISOString() : null,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    // setSearch("");
    setPage(1);
  };

  /* ✅ FIXED (no .length crash) */
  const hasActiveFilters =
    Object.values(activeFilters).some(
      (val) => val !== undefined && val !== null && val !== ""
    );

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const showSearchbar = !title;

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center gap-4">
          {showSearchbar && (
            <div className="flex gap-2 items-center px-3 border border-border rounded-lg w-1/2">
              <Search size={26} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full py-3 outline-0"
              />
              <button className={`${search ? "visible" : "invisible"}`} disabled={!search} onClick={() => setSearch("")}>
                <IoClose size={20} className="text-gray-400" />
              </button>
            </div>
          )}

          {title && <span className="font-semi">{title}</span>}

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <PrimaryButton
                label="Clear Filters"
                hollow
                variant="rounded"
                onClick={clearFilters}
                className="border-red-400 hover:bg-red-50 text-red-400"
              />
            )}

            {filters.length > 0 && (
              <PrimaryButton
                label="Filters"
                onClick={() => setShowFilters((p) => !p)}
                variant="rounded"
                hollow
              />
            )}

            {actionButton && <div>{actionButton}</div>}
          </div>
        </div>

        {showFilters && filters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {filters.map((f) => {
              if (f.type === "select") {
                return (
                  <FilterDropdown
                    key={f.key}
                    label={f.label}
                    options={f.options}
                    /* ✅ FIXED (no string restriction) */
                    value={activeFilters[f.key]}
                    onChange={(val) => handleFilterChange(f.key, val)}
                  />
                );
              }

              if (f.type === "date") {
                return (
                  <FilterDate
                    key={f.key}
                    label={f.label}
                    value={activeFilters[f.key] as string}
                    onChange={(date) => handleDateChange(f.key, date)}
                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      <div className="h-4" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DynamicTable headers={headers} rows={rows} loading={loading} />

        <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50 border-t border-border">
          <span className="text-xs text-slate-500">
            Showing <b>{start} to {end}</b> of {total}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-primary disabled:opacity-30"
            >
              <ChevronLeft />
            </button>

            {getPages().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-xs text-gray-400">...</span>
              ) : (
                <button
                  key={i}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 text-xs rounded ${page === p
                    ? "bg-primary-deep text-white"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-primary disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}