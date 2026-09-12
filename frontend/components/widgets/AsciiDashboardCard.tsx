'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Terminal, Copy, Check, Maximize2 } from 'lucide-react';
import { AsciiModal } from './AsciiModal';

export const AsciiDashboardCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawAscii = `╔══════════════════════════════════════╗
║       CYBER THREAT DASHBOARD         ║
╠══════════════════════════════════════╣
║                                      ║
║  Total Events       12,450           ║
║  Threats              327            ║
║  Critical              18            ║
║  High                  72            ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║ Attack Distribution                  ║
║                                      ║
║ DDoS           ██████████            ║
║ Port Scan      ███████               ║
║ Botnet         █████                 ║
║ Exploit        ████                  ║
║                                      ║
╠══════════════════════════════════════╣
║ Recent Alerts                        ║
║                                      ║
║ DDoS     HIGH      94%               ║
║ Scan     MEDIUM    87%               ║
║ Botnet   CRITICAL  96%               ║
╚══════════════════════════════════════╝`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawAscii);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden relative group">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#EECC8C] via-[#9EABA2] to-[#A36361]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/[0.08] mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0B0F19] text-[#EECC8C] border border-[#EECC8C]/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>ASCII SOC Console</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9EABA2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9EABA2]"></span>
                </span>
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Live Telemetry Matrix</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-gray-100 dark:bg-[#0B0F19] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs transition"
              title="Copy ASCII Art to Clipboard"
              aria-label="Copy ASCII Art"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#9EABA2]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 rounded-md bg-gray-100 dark:bg-[#0B0F19] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs transition"
              title="Expand Full View"
              aria-label="Expand Full View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ASCII Content Box */}
        <pre className="font-mono text-[11px] sm:text-xs text-[#9EABA2] bg-[#0B0F19] p-3.5 rounded-lg border border-[#EECC8C]/30 shadow-inner overflow-x-auto whitespace-pre leading-tight select-all">
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
      </Card>

      <AsciiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AsciiDashboardCard;
