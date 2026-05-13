import { Activity, Zap } from "lucide-react";

type Props = {
    apiStatus: "online" | "offline";
    uptime: string;
    queue: number;
    avgTime: string;
    modules: {
        name: string;
        status: "healthy" | "error";
    }[];
};

export function SystemHealthCard({
    apiStatus,
    uptime,
    queue,
    avgTime,
    modules,
}: Props) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">

            {/* Header */}
            <h4 className="text-lg font-bold flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                System Health
            </h4>

            {/* API Status */}
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        API Status
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Ping Dot */}
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </div>

                        <span className="text-sm font-bold capitalize">
                            {apiStatus}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                        Uptime
                    </p>
                    <p className="text-xs font-bold">{uptime}</p>
                </div>
            </div>

            {/* Queue */}
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Processing Queue
                    </p>

                    <p className="text-2xl font-extrabold">
                        {queue}
                        <span className="text-[10px] text-gray-400 ml-1">
                            cases
                        </span>
                    </p>
                </div>

                {/* Spinner */}
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            </div>

            {/* Avg Time */}
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Avg. Processing Time
                    </p>

                    <p className="text-2xl font-extrabold">
                        {avgTime}
                    </p>
                </div>

                <Zap className="text-primary" size={26} />
            </div>

            {/* Modules */}
            <div className="pt-4 border-t">
                <h5 className="text-xs font-bold text-gray-500 uppercase mb-4">
                    Module Health
                </h5>

                <div className="space-y-3">
                    {modules.map((mod, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center"
                        >
                            <span className="text-xs font-medium">
                                {mod.name}
                            </span>

                            <span
                                className={`w-2 h-2 rounded-full ${mod.status === "healthy"
                                    ? "bg-primary"
                                    : "bg-red-500"
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}