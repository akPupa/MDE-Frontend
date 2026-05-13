import { type LucideIcon } from "lucide-react";
import { type IconType } from "react-icons";

export type StatsItem = {
    label: string;
    value: string;
    icon: LucideIcon | IconType;
    stat?: string;
    variant?: "green" | "yellow" | "red" | "blue";
};