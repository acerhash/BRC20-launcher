"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface SparklineProps {
  data: { value: number }[];
  color?: string;
}

export default function Sparkline({ data, color = "#10b981" }: SparklineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return <div className="w-24 h-10 bg-slate-800/50 rounded animate-pulse" />;
  }

  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
