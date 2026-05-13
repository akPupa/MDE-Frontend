import type { ReactNode } from "react";

export type Align = "left" | "center" | "right";

export type BaseCell = {
  value?: string | number;
  type?: "text" | "pill" | "button" | "link" | "element";
};

export type PillCell = BaseCell & {
  type: "pill";
  color?: "red" | "yellow" | "blue" | "green" | "orange" | "teal";
};

export type ButtonCell = BaseCell & {
  type: "button";
  element?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export type TableCell = BaseCell | PillCell | ButtonCell;
export type TableRow = Record<string, TableCell>;

export type TableHeader = {
  key: string;
  label: string;
  align?: Align;
};

export type TableProps = {
  headers: TableHeader[];
  rows: TableRow[];
  loading?: boolean;
};

type BaseFilter = {
  key: string;
  label: string;
};

export type Option = {
  label: string;
  value: string | boolean;
};

export type SelectFilter = BaseFilter & {
  type: "select";
  options: Option[];
};

export type DateFilter = BaseFilter & {
  type: "date";
};

export type Filter = SelectFilter | DateFilter;

/* ✅ FIXED */
export type FilterValue = string | boolean | null;

export type ServerTableProps = {
  headers: TableHeader[];
  fetchData: (params: {
    search: string;
    filters: Record<string, FilterValue>;
    page: number;
    pageSize: number;
  }) => Promise<{
    rows: TableRow[];
    total: number;
  }>;
  filters?: Filter[];
  searchPlaceholder?: string;
  defaultPageSize?: number;
  actionButton?: ReactNode;
  title?: string;
};