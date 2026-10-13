import React from "react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
}) => {
  const rounded = Math.round(score);

  let colorClasses = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let ringColor = "stroke-emerald-600";
  if (rounded < 60) {
    colorClasses = "text-rose-700 bg-rose-50 border-rose-200";
    ringColor = "stroke-rose-600";
  } else if (rounded < 85) {
    colorClasses = "text-amber-700 bg-amber-50 border-amber-200";
    ringColor = "stroke-amber-600";
  }

  if (size === "lg") {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (rounded / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`${ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black tracking-tight text-slate-900">{rounded}%</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Score</span>
          </div>
        </div>
        {showLabel && (
          <span className="mt-2 text-xs font-semibold text-slate-600">
            {rounded >= 85 ? "Statutory Compliance Met" : rounded >= 60 ? "Requires Verification" : "Legal Notice Trigger"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border font-bold text-xs ${colorClasses}`}>
      <span>{rounded}%</span>
      {showLabel && <span className="font-medium text-slate-500">&bull; Score</span>}
    </div>
  );
};
