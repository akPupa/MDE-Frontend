import { type StatsItem } from "./types";
import { StatsCard } from "./StatsCard";

type Props = {
    data: StatsItem[];
};

export function StatsGrid({ data }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {data.map((item, index) => (
                <StatsCard key={index} {...item} />
            ))}
        </div>
    );
}