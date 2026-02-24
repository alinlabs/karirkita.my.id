
import React from 'react';
import { cn } from '../../utils/cn';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
  description?: string;
}

interface ChartProps {
  type: 'bar' | 'circle' | 'progress';
  data: ChartDataPoint[];
  className?: string;
  height?: number;
  showLabel?: boolean;
}

const CircleChart = ({ data, size = 64 }: { data: ChartDataPoint[], size?: number }) => {
  // Only supports single value focus for circle in this compact view
  const item = data[0];
  const value = Math.min(100, Math.max(0, item.value));
  // Adjusted radius and stroke for better mobile visibility
  const strokeWidth = 6; 
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment Calculations
  // 1. Red Segment: 0% - 50%
  const valRed = Math.min(value, 50);
  const offsetRed = circumference - (valRed / 100) * circumference;

  // 2. Yellow Segment: 50% - 70%
  const valYellow = Math.max(0, Math.min(value, 70) - 50);
  const offsetYellow = circumference - (valYellow / 100) * circumference;

  // 3. Green Segment: 70% - 100%
  const valGreen = Math.max(0, value - 70);
  const offsetGreen = circumference - (valGreen / 100) * circumference;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        {/* SVG Container - Rotated -90deg so 0 is top */}
        <svg className="transform -rotate-90 w-full h-full">
          {/* Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200"
          />
          
          {/* Red Segment (0-50%) - Starts at Top (0deg) */}
          {value > 0 && (
            <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offsetRed}
                strokeLinecap={value <= 50 ? "round" : "butt"}
                className="text-red-500 transition-all duration-1000 ease-out"
            />
          )}

          {/* Yellow Segment (50-70%) - Starts at Bottom (180deg) */}
          {value > 50 && (
            <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offsetYellow}
                strokeLinecap={value <= 70 ? "round" : "butt"}
                className="text-yellow-500 transition-all duration-1000 ease-out"
                style={{ transform: 'rotate(180deg)', transformOrigin: '50% 50%' }}
            />
          )}

          {/* Green Segment (70-100%) - Starts at 252deg (360 * 0.7) */}
          {value > 70 && (
            <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offsetGreen}
                strokeLinecap="round"
                className="text-green-500 transition-all duration-1000 ease-out"
                style={{ transform: 'rotate(252deg)', transformOrigin: '50% 50%' }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xs md:text-sm font-black text-slate-900">{item.value}{item.suffix || '%'}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight">{item.label}</p>
        {item.description && <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{item.description}</p>}
      </div>
    </div>
  );
};

const BarChart = ({ data }: { data: ChartDataPoint[] }) => {
  // Find max value to normalize bars relative to each other if needed, 
  // or assume value is percentage 0-100.
  const maxValue = Math.max(...data.map(d => d.value), 100);

  const getBarColor = (label: string) => {
    const lowerLabel = label.toLowerCase();
    // Specific logic for "Before" (Merah) vs "After" (Hijau) comparison
    if (lowerLabel.includes('sebelum')) return 'bg-red-500';
    if (lowerLabel.includes('sesudah')) return 'bg-green-500';
    
    // Default fallback
    return 'bg-blue-600';
  };

  return (
    <div className="space-y-3 w-full">
      {data.slice(0, 3).map((item, idx) => {
        const width = (item.value / maxValue) * 100;
        const barColor = item.color || getBarColor(item.label);

        return (
          <div key={idx} className="w-full">
            <div className="flex justify-between text-[10px] md:text-xs mb-1.5">
              <span className="font-bold text-slate-700 truncate max-w-[70%]">{item.label}</span>
              <span className="font-extrabold text-slate-900">{item.value}{item.suffix || '%'}</span>
            </div>
            {/* Thicker bar height (h-2) for mobile visibility */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out", 
                    barColor
                )}
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Chart: React.FC<ChartProps> = ({ type, data, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {type === 'circle' && <CircleChart data={data} />}
      {type === 'bar' && <BarChart data={data} />}
    </div>
  );
};
