import React from "react";

export const ScoreBadge = ({ score = 100, size = "md", showLabel = true }) => {
  const rounded = Math.round(Number(score) || 0);

  let colorClasses = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  let ringColor = "stroke-emerald-500";
  let labelText = "Statutory Compliance Met";

  if (rounded < 60) {
    colorClasses = "text-rose-400 bg-rose-500/10 border-rose-500/30";
    ringColor = "stroke-rose-500";
    labelText = "Legal Notice Trigger / High Risk";
  } else if (rounded < 85) {
    colorClasses = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    ringColor = "stroke-amber-500";
    labelText = "Requires Inspector Verification";
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
              className="stroke-parakh-border"
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
            <span className="text-2xl font-black tracking-tight text-parakh-text">{rounded}%</span>
            <span className="text-[10px] font-semibold text-parakh-muted uppercase tracking-wider">Score</span>
          </div>
        </div>
        {showLabel && (
          <span className="mt-2 text-xs font-semibold text-parakh-muted">
            {labelText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border font-bold text-xs ${colorClasses}`}>
      <span>{rounded}%</span>
      {showLabel && <span className="font-medium text-slate-400">&bull; Score</span>}
    </div>
  );
};
