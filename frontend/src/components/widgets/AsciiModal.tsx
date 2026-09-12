"use client";

import React from "react";
import { X } from "lucide-react";

interface AsciiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AsciiModal({ isOpen, onClose }: AsciiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative max-w-full">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors p-1 flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          aria-label="Close modal"
        >
          <span>ESC / Close</span>
          <X size={18} />
        </button>

        {/* ASCII Container */}
        <pre className="font-mono text-xs sm:text-sm md:text-base text-[#9EABA2] bg-[#0B0F19] p-6 rounded-lg border border-[#EECC8C]/50 shadow-2xl overflow-x-auto whitespace-pre leading-tight">
{`╔══════════════════════════════════════╗
║       `}<span className="text-[#EECC8C] font-bold">CYBER THREAT DASHBOARD</span>{`         ║
╠══════════════════════════════════════╣
║                                      ║
║  Total Events       `}<span className="text-white font-bold">12,450</span>{`           ║
║  Threats              `}<span className="text-[#EECC8C] font-bold">327</span>{`            ║
║  `}<span className="text-[#A36361] font-bold">Critical              18</span>{`            ║
║  `}<span className="text-[#E8B298] font-bold">High                  72</span>{`            ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║ `}<span className="text-white font-semibold">Attack Distribution</span>{`                  ║
║                                      ║
║ DDoS           `}<span className="text-[#A36361]">██████████</span>{`            ║
║ Port Scan      `}<span className="text-[#E8B298]">███████</span>{`               ║
║ Botnet         `}<span className="text-[#EECC8C]">█████</span>{`                 ║
║ Exploit        `}<span className="text-[#9EABA2]">████</span>{`                  ║
║                                      ║
╠══════════════════════════════════════╣
║ `}<span className="text-white font-semibold">Recent Alerts</span>{`                        ║
║                                      ║
║ DDoS     `}<span className="text-[#E8B298] font-bold">HIGH</span>{`      94%               ║
║ Scan     `}<span className="text-[#EECC8C] font-bold">MEDIUM</span>{`    87%               ║
║ Botnet   `}<span className="text-[#A36361] font-bold">CRITICAL</span>{`  96%               ║
╚══════════════════════════════════════╝`}
        </pre>
      </div>
    </div>
  );
}

export default AsciiModal;
