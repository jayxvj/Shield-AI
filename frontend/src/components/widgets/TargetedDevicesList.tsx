'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { TargetedDevice } from '@/types/threat';
import { 
  Server, 
  Database, 
  ShieldAlert, 
  Cpu, 
  HardDrive 
} from 'lucide-react';

interface TargetedDevicesListProps {
  devices: TargetedDevice[];
}

const typeIconMap: Record<string, React.ReactNode> = {
  Server: <Server className="w-4 h-4 text-gray-400" />,
  Database: <Database className="w-4 h-4 text-yellow-600 dark:text-[#EECC8C]" />,
  Firewall: <ShieldAlert className="w-4 h-4 text-[#E8B298]" />,
  Gateway: <Cpu className="w-4 h-4 text-[#A36361]" />,
  Workstation: <HardDrive className="w-4 h-4 text-gray-400" />,
};

export const TargetedDevicesList: React.FC<TargetedDevicesListProps> = ({ devices }) => {
  return (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-yellow-600 dark:text-[#EECC8C]" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
            Targeted Endpoints
          </h2>
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
          {devices.length} Monitored
        </span>
      </div>

      {/* Devices List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
        {devices.map((device) => {
          const isCritical = device.status === 'Critical';
          const isWarning = device.status === 'Warning';
          
          let statusBadge = 'bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border-[#9EABA2]/30';
          let statusDot = 'bg-[#9EABA2] dark:bg-[#BDD1C5]';

          if (isCritical) {
            statusBadge = 'bg-[#A36361]/20 text-[#A36361] border-[#A36361]/30';
            statusDot = 'bg-[#A36361]';
          } else if (isWarning) {
            statusBadge = 'bg-[#E8B298]/20 text-[#C47B5E] dark:text-[#E8B298] border-[#E8B298]/30';
            statusDot = 'bg-[#E8B298]';
          }

          return (
            <div
              key={device.id}
              className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#141823]/80 border border-gray-200 dark:border-white/[0.05] hover:border-gray-300 dark:hover:border-white/[0.15] hover:bg-gray-100 dark:hover:bg-[#222938]/80 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06] shadow-sm">
                  {typeIconMap[device.type] || <Server className="w-4 h-4 text-gray-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-[#EECC8C] transition-colors duration-200">
                      {device.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    <span>{device.ip}</span>
                    <span>•</span>
                    <span>{device.lastPing}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 uppercase ${statusBadge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  {device.status}
                </span>
                
                {device.threatCount > 0 ? (
                  <span className="text-[10px] text-[#A36361] font-mono font-medium">
                    {device.threatCount} {device.threatCount === 1 ? 'alert' : 'alerts'}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#5F6F65] dark:text-[#BDD1C5] font-mono">
                    0 alerts
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200 dark:border-white/[0.07] flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
        <span>EDR Host Sensor: Active</span>
        <span className="text-[#5F6F65] dark:text-[#BDD1C5] font-mono font-medium">All Healthy</span>
      </div>
    </Card>
  );
};

export default TargetedDevicesList;
