"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const TRACK = "#03284214";
const ACCENT = "#EDB254";
const NAVY = "#032842";

export type SpeedometerMetric = {
  title: string;
  href: string;
  value: number;
  max: number;
  detail: string;
};

function needlePoints(cx: number, cy: number, angleDeg: number, length: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const x = cx + length * Math.cos(rad);
  const y = cy + length * Math.sin(rad);
  const base = 5;
  const left = rad + Math.PI / 2;
  const right = rad - Math.PI / 2;
  return [
    `${cx + base * Math.cos(left)},${cy + base * Math.sin(left)}`,
    `${x},${y}`,
    `${cx + base * Math.cos(right)},${cy + base * Math.sin(right)}`,
  ].join(" ");
}

function GaugeFace({ value, max }: { value: number; max: number }) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(Math.max(value / safeMax, 0), 1);
  const data = [
    { name: "filled", value: ratio },
    { name: "rest", value: 1 - ratio },
  ];

  // Semi-circle: -90° (left) → 90° (right) in Recharts = startAngle 180, endAngle 0
  const needleAngle = 180 - ratio * 180;
  const cx = 100;
  const cy = 100;

  return (
    <div className="relative mx-auto h-[140px] w-full max-w-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="70%"
            innerRadius="68%"
            outerRadius="92%"
            stroke="none"
            paddingAngle={0}
            isAnimationActive
            animationDuration={700}
          >
            <Cell fill={ACCENT} />
            <Cell fill={TRACK} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 140"
        aria-hidden
      >
        <polygon
          points={needlePoints(cx, 98, needleAngle, 58)}
          fill={NAVY}
        />
        <circle cx={cx} cy={98} r={6} fill={NAVY} />
        <circle cx={cx} cy={98} r={2.5} fill={ACCENT} />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <p className="text-3xl font-bold tracking-tight text-[#032842]">
          {value}
        </p>
      </div>
    </div>
  );
}

export function SpeedometerGauges({ metrics }: { metrics: SpeedometerMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Link
          key={metric.title}
          href={metric.href}
          className="rounded-2xl border border-[#032842]/6 bg-white p-5 shadow-[0_12px_32px_rgba(3,40,66,0.05)] transition-transform hover:-translate-y-0.5"
        >
          <h2 className="text-center text-base font-semibold">{metric.title}</h2>
          <GaugeFace value={metric.value} max={metric.max} />
          <p className="mt-1 text-center text-sm text-[#032842]/45">
            {metric.detail}
          </p>
        </Link>
      ))}
    </div>
  );
}
