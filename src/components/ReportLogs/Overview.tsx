import { Check } from "lucide-react";
import React from "react";

export type DayData = {
    day: string;
    value: number;
};

type Props = {
    successRate: number;
    growthText: string;
    reportText: string;
    weeklyData: DayData[];
};

const Overview: React.FC<Props> = ({
    successRate,
    growthText,
    reportText,
    weeklyData,
}) => {
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LEFT CARD */}
            <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-2xl shadow-lg shadow-teal-900/5 relative overflow-hidden group">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Success Rate
                </p>

                <h3 className="text-4xl font-extrabold text-primary mb-2">
                    {successRate}%
                </h3>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                    {growthText}
                </p>
            </div>

            {/* RIGHT CARD */}
            <div className="md:col-span-2 bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden flex items-center text-white">

                {/* TEXT */}
                <div className="flex-grow z-10">
                    <h4 className="text-xl font-extrabold mb-1">
                        Weekly Report Overview
                    </h4>

                    <p className="text-sm max-w-md">
                        {reportText}
                    </p>
                </div>

                {/* CHART */}
                <div className="hidden sm:flex gap-4 z-10">
                    {weeklyData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">

                            <div className="w-2 bg-white/20 h-16 rounded-full relative overflow-hidden">
                                <div
                                    className="absolute bottom-0 w-full bg-white rounded-full"
                                    style={{
                                        height: `${item.value}%`, // dynamic height
                                    }}
                                />
                            </div>

                            <span className="text-[10px] text-white mt-1 uppercase font-bold">
                                {item.day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* DECORATIVE */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Overview;