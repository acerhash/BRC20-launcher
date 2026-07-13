"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineProps {
  data: { interval: string; volume: number }[];
  isCompleted: boolean;
}

export function Sparkline({ data, isCompleted }: SparklineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse border border-white/5" />
    );
  }

  const gradientColor = isCompleted ? "#22c55e" : "#3b82f6";

  return (
    <div className="w-full h-12 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={`gradient-${isCompleted ? 'green' : 'blue'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={gradientColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#0b1329] border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/95 shadow-md">
                    <span className="text-white/50">{payload[0].payload.interval}:</span>{" "}
                    <span className="font-bold text-white">{payload[0].value} mints</span>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke={gradientColor}
            strokeWidth={1.5}
            fill={`url(#gradient-${isCompleted ? 'green' : 'blue'})`}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: gradientColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
