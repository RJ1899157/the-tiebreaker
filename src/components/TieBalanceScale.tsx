import React from "react";
import { motion } from "motion/react";
import { Scale, ArrowLeftRight } from "lucide-react";

interface TieBalanceScaleProps {
  leftName: string;
  leftWeight: number;
  rightName: string;
  rightWeight: number;
  centerText?: string;
  colorLeft?: string;
  colorRight?: string;
}

export default function TieBalanceScale({
  leftName,
  leftWeight,
  rightName,
  rightWeight,
  centerText,
  colorLeft = "#10b981", // emerald
  colorRight = "#f43f5e", // rose
}: TieBalanceScaleProps) {
  const total = leftWeight + rightWeight;
  // Calculate relative angle centered on a 0 baseline
  const diff = leftWeight - rightWeight;
  const maxVal = Math.max(total, 1);
  const tiltDegrees = (diff / maxVal) * 20; // Max tilt is 20 deg left or right

  // Vertical offsets for pans
  const leftOffset = (tiltDegrees / 20) * 15; // moves down as tilt is positive (left heavier)
  const rightOffset = -(tiltDegrees / 20) * 15; // moves up

  return (
    <div id="tie-balance-scale" className="flex flex-col items-center justify-center p-6 bg-[#0F0F11] border border-[#222222] rounded-2xl shadow-xl">
      <div className="text-center mb-4">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase">Interactive Weighing Engine</span>
        <h3 className="text-xs font-serif italic text-white flex items-center justify-center gap-1.5 mt-1 tracking-wider">
          <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
          The Scaled Balance
        </h3>
      </div>

      {/* SVG Interactive Scale Canvas */}
      <div className="relative w-full max-w-[320px] h-[180px] flex items-center justify-center">
        <svg viewBox="0 0 300 180" className="w-full h-full overflow-visible">
          {/* Base of the Scale */}
          <path
            d="M 120 160 L 180 160 L 165 110 L 135 110 Z"
            fill="#151516"
            stroke="#222222"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect x="100" y="160" width="100" height="10" rx="2" fill="#222222" />
          <line x1="150" y1="110" x2="150" y2="40" stroke="#333333" strokeWidth="4" />

          {/* Pivot Pin */}
          <circle cx="150" cy="40" r="5" fill="#C5A059" />

          {/* Central Rotating Beam */}
          <g style={{ transform: `rotate(${-tiltDegrees}deg)`, transformOrigin: "150px 40px", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {/* The main lever beam */}
            <line x1="50" y1="40" x2="250" y2="40" stroke="#444444" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="40" r="4" fill="#C5A059" />
            <circle cx="250" cy="40" r="4" fill="#C5A059" />

            {/* Left hanger links (vertical) */}
            <line x1="50" y1="40" x2="50" y2="100" stroke="#333333" strokeWidth="1.5" />
            
            {/* Right hanger links (vertical) */}
            <line x1="250" y1="40" x2="250" y2="100" stroke="#333333" strokeWidth="1.5" />
          </g>

          {/* Left Pan (Translates down if left weighs more) */}
          <g style={{ transform: `translateY(${leftOffset}px)`, transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {/* Hanger strings spreading */}
            <line x1="50" y1="100" x2="30" y2="130" stroke="#222222" strokeWidth="1.5" />
            <line x1="50" y1="100" x2="70" y2="130" stroke="#222222" strokeWidth="1.5" />
            {/* Pan Plate */}
            <path d="M 20 130 C 20 145, 80 145, 80 130 Z" fill="#0A0A0B" stroke="#222222" strokeWidth="1.5" />
            {/* Weights Indicator */}
            <circle cx="50" cy="120" r="10" fill={colorLeft} fillOpacity="0.15" />
            <text x="50" y="123" textAnchor="middle" fontSize="10" fontWeight="bold" fill={colorLeft}>
              {leftWeight}
            </text>
          </g>

          {/* Right Pan (Translates down if right weighs more) */}
          <g style={{ transform: `translateY(${rightOffset}px)`, transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {/* Hanger strings spreading */}
            <line x1="250" y1="100" x2="230" y2="130" stroke="#222222" strokeWidth="1.5" />
            <line x1="250" y1="100" x2="270" y2="130" stroke="#222222" strokeWidth="1.5" />
            {/* Pan Plate */}
            <path d="M 220 130 C 220 145, 280 145, 280 130 Z" fill="#0A0A0B" stroke="#222222" strokeWidth="1.5" />
            {/* Weights Indicator */}
            <circle cx="250" cy="120" r="10" fill={colorRight} fillOpacity="0.15" />
            <text x="250" y="123" textAnchor="middle" fontSize="10" fontWeight="bold" fill={colorRight}>
              {rightWeight}
            </text>
          </g>
        </svg>

        {/* Dynamic Center Advice Bubble (Tells which side is dominant/neutral) */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#151516] border border-[#222222] text-[#D1D1D1] text-[9px] font-mono px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 select-none uppercase tracking-wider">
          {diff > 0 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <span>{leftName} Leads</span>
            </>
          ) : diff < 0 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-800 animate-pulse" />
              <span>{rightName} Leads</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>Exact Tie</span>
            </>
          )}
        </div>
      </div>

      {/* Label Legends */}
      <div className="w-full grid grid-cols-2 text-xs font-medium border-t border-[#1A1A1A] pt-3 mt-1 px-2 select-none">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[#666666] font-mono uppercase text-[8px] tracking-[0.2em]">{leftName} Factor</span>
          <span className="text-[#AAAAAA] flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorLeft }} />
            Sum: <strong className="font-mono text-white">{leftWeight}</strong>
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5 border-l border-[#1A1A1A] pl-4">
          <span className="text-[#666666] font-mono uppercase text-[8px] tracking-[0.2em]">{rightName} Factor</span>
          <span className="text-[#AAAAAA] flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorRight }} />
            Sum: <strong className="font-mono text-white">{rightWeight}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
