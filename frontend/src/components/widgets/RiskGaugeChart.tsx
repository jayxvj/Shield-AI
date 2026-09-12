'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { ShieldAlert, Info } from 'lucide-react';

interface RiskGaugeChartProps {
  score: number; // 0 - 100
}

export const RiskGaugeChart: React.FC<RiskGaugeChartProps> = ({ score = 74 }) => {
  // Semi-circle gauge calculations (180 degrees)
  const radius = 78;
  const strokeWidth = 14;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Circumference of semi-circle = Math.PI * radius
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine risk level category & color
  let riskLevel = 'Low Risk';
  let riskColor = '#9EABA2';
  let badgeBg = 'bg-[#9EABA2]/20 text-[#BDD1C5] border-[#9EABA2]/30';

  if (normalizedScore >= 70) {
    riskLevel = 'High Risk';
    riskColor = '#A36361';
    badgeBg = 'bg-[#A36361]/20 text-[#A36361] border-[#A36361]/30';
  } else if (normalizedScore >= 40) {
    riskLevel = 'Medium Risk';
    riskColor = '#E8B298';
    badgeBg = 'bg-[#E8B298]/20 text-[#E8B298] border-[#E8B298]/30';
  }

  return (
    <Card className="flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#A36361]" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Threat Level Risk Score
          </h2>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${badgeBg}`}>
          {riskLevel}
        </span>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-auto pt-2">
        <svg
          className="w-56 h-32 overflow-visible"
          viewBox="0 0 200 115"
          aria-label={`Risk score gauge displaying ${normalizedScore} out of 100`}
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9EABA2" />
              <stop offset="35%" stopColor="#BDD1C5" />
              <stop offset="60%" stopColor="#EECC8C" />
              <stop offset="80%" stopColor="#E8B298" />
              <stop offset="100%" stopColor="#A36361" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#A36361" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="#141823"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Subtle tick marks */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray="2 12"
            strokeLinecap="butt"
          />

          {/* Colored Progress Arc */}
          <path
            d="M 22 100 A 78 78 0 0 1 178 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Big Number */}
        <div className="absolute top-[52px] flex flex-col items-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {normalizedScore}
            </span>
            <span className="text-xs text-gray-400 font-medium ml-1">/100</span>
          </div>
          <p className="text-[11px] font-medium text-gray-400 -mt-0.5">
            Composite Threat Index
          </p>
        </div>
      </div>

      {/* Scale Labels & Bottom Context */}
      <div className="pt-2 border-t border-white/[0.07]">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1.5 px-2">
          <span className="text-[#9EABA2]">0 (Normal)</span>
          <span className="text-[#EECC8C]">50 (Elevated)</span>
          <span className="text-[#A36361]">100 (Critical)</span>
        </div>
        <p className="text-[11px] text-gray-400 text-center leading-snug">
          Real-time aggregation of 38 active threat vectors & ML anomaly weights.
        </p>
      </div>
    </Card>
  );
};
