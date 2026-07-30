"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

interface RadialProgressRingProps {
  progressPercentage?: number; // 0 to 100
  status: "Completed" | "In Progress" | "Failed";
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  deliveredCount?: number;
  recipientCount?: number;
  id?: string;
}

export default function RadialProgressRing({
  progressPercentage,
  status,
  size = 38,
  strokeWidth = 3.5,
  showLabel = true,
  deliveredCount,
  recipientCount,
  id
}: RadialProgressRingProps) {
  // Derive progress percentage if not explicitly provided
  let calculatedProgress = 100;
  if (progressPercentage !== undefined) {
    calculatedProgress = progressPercentage;
  } else if (deliveredCount !== undefined && recipientCount && recipientCount > 0) {
    calculatedProgress = Math.round((deliveredCount / recipientCount) * 100);
  } else if (status === "Failed") {
    calculatedProgress = 15;
  } else if (status === "In Progress") {
    calculatedProgress = 50;
  }

  const clampedProgress = Math.min(100, Math.max(0, calculatedProgress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Theme configuration based on status & percentage
  let colorHex = "#f59e0b"; // default amber
  let textClass = "text-amber-400";
  let trackHex = "rgba(245, 158, 11, 0.15)";
  let badgeClass = "bg-amber-500/10 text-amber-300 border-amber-500/30";
  let statusText = `${clampedProgress}% Active`;

  if (status === "Completed" || clampedProgress >= 100) {
    colorHex = "#10b981"; // emerald
    textClass = "text-emerald-400";
    trackHex = "rgba(16, 185, 129, 0.15)";
    badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    statusText = "Completed";
  } else if (status === "Failed") {
    colorHex = "#f43f5e"; // rose
    textClass = "text-rose-400";
    trackHex = "rgba(244, 63, 94, 0.15)";
    badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    statusText = "Failed";
  } else {
    colorHex = "#06b6d4"; // cyan for active progress
    textClass = "text-cyan-400";
    trackHex = "rgba(6, 182, 212, 0.15)";
    badgeClass = "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
    statusText = `${clampedProgress}% Distributing`;
  }

  return (
    <div className="inline-flex items-center gap-2.5 font-mono" id={id}>
      {/* Radial Ring Graphic Container */}
      <div
        className="relative inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackHex}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Stroke Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorHex}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content / Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
          {status === "Completed" || clampedProgress >= 100 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : status === "Failed" ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <span className={`${textClass} font-extrabold text-[9px]`}>
              {clampedProgress}%
            </span>
          )}
        </div>
      </div>

      {/* Label and Progress Subtext */}
      {showLabel && (
        <div className="flex flex-col text-left">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full font-bold border ${badgeClass}`}
          >
            {status === "In Progress" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
              </span>
            )}
            {status === "Completed" ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Completed
              </span>
            ) : status === "Failed" ? (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Failed
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
                {clampedProgress}% Active
              </span>
            )}
          </span>

          {deliveredCount !== undefined && recipientCount !== undefined ? (
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">
              {deliveredCount}/{recipientCount} delivered
            </span>
          ) : status === "In Progress" ? (
            <span className="text-[9px] text-cyan-400/80 font-mono mt-0.5">
              Distributing onchain...
            </span>
          ) : status === "Completed" ? (
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">
              100% Confirmed
            </span>
          ) : (
            <span className="text-[9px] text-rose-400/80 font-mono mt-0.5">
              Reverted onchain
            </span>
          )}
        </div>
      )}
    </div>
  );
}
