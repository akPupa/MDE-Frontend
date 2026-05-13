import { format, parseISO } from "date-fns"

export const formaToMonthDayYear = (dateStr: string | undefined) => {
    if (!dateStr) return ""
    const date = parseISO(dateStr)
    return format(date, "MM-dd-yyyy")
}