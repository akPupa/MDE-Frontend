export function maskNameShort(fullName: string) {
    return fullName
        .split(" ")
        .map(word => {
            if (word.length <= 1) return word;
            return word[0] + "*".repeat(Math.min(4, word.length - 1));
        })
        .join(" ");
}

export function capitalizeFirst(str: string | null | undefined) {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toRoman = (num: number): string => {
    const map: [number, string][] = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];

    let result = "";

    for (const [value, symbol] of map) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
};

export const formatWithNewLines = (text: string): string => {
    return text.split(";").map(s => s.trim()).join("\n");
};