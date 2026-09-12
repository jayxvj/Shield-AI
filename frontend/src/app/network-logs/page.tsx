'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { mockRawNetworkLogs, RawNetworkLog } from '@/lib/mock-data';
import { 
  Search, 
  RotateCcw, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Radio, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

export default function NetworkLogsPage() {
  const [logs] = useState<RawNetworkLog[]>(mockRawNetworkLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [flaggedOnly, setFlaggedOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search by srcIp or dstIp
      const matchesSearch = 
        log.srcIp.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        log.dstIp.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        String(log.srcPort).includes(searchTerm.trim()) ||
        String(log.dstPort).includes(searchTerm.trim());

      // Protocol filter
      const matchesProtocol = 
        selectedProtocol === 'All' || log.protocol === selectedProtocol;

      // Status filter
      const matchesStatus = 
        selectedStatus === 'All' || log.status === selectedStatus;

      // Flagged only toggle
      const matchesFlagged = 
        !flaggedOnly || log.status !== 'Normal';

      return matchesSearch && matchesProtocol && matchesStatus && matchesFlagged;
    });
  }, [logs, searchTerm, selectedProtocol, selectedStatus, flaggedOnly]);

  // Reset pagination on filter change
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProtocol('All');
    setSelectedStatus('All');
    setFlaggedOnly(false);
    setCurrentPage(1);
  };

  // Stats calculation
  const totalPacketsCount = filteredLogs.length;
  const anomalyCount = filteredLogs.filter((l) => l.status !== 'Normal').length;
  const anomalyRate = totalPacketsCount > 0 
    ? ((anomalyCount / totalPacketsCount) * 100).toFixed(1) 
    : '0.0';
  const avgFlowDuration = totalPacketsCount > 0 
    ? Math.round(filteredLogs.reduce((acc, curr) => acc + curr.flowDurationMs, 0) / totalPacketsCount) 
    : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span>Live Network Traffic Telemetry</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#9EABA2]/15 border border-[#9EABA2]/30 text-xs text-[#5F6F65] dark:text-[#BDD1C5]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9EABA2] dark:bg-[#BDD1C5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9EABA2] dark:bg-[#BDD1C5]"></span>
              </span>
              <span className="font-semibold text-[11px] tracking-wide">
                Ingestion Active (CIC-IDS Ingestor)
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Granular packet flow and real-time anomaly filtering across internal subnet assets.
          </p>
        </div>

        {/* Live Ingestion Indicator Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm self-start md:self-auto">
          <Radio className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5] animate-pulse" />
          <span className="font-mono text-[11px]">Capture Rate: 48,290 pkts/s</span>
        </div>
      </div>

      {/* 2. Filter Controls Bar */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Source IP, Destination IP, Port, or Flow ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 focus:border-[#EECC8C] dark:focus:border-[#EECC8C]/50 rounded-lg pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#EECC8C]/40 transition-all duration-200"
            />
          </div>

          {/* Dropdown Filters & Toggles */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Protocol Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Protocol:</span>
              <select
                value={selectedProtocol}
                onChange={(e) => {
                  setSelectedProtocol(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#EECC8C] transition-all cursor-pointer"
                aria-label="Filter by Protocol"
              >
                <option value="All">All Protocols</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="HTTP">HTTP</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#EECC8C] transition-all cursor-pointer"
                aria-label="Filter by AI Status"
              >
                <option value="All">All Statuses</option>
                <option value="Normal">Normal</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Malicious">Malicious</option>
              </select>
            </div>

            {/* Quick Toggle: Flagged Only */}
            <button
              onClick={() => {
                setFlaggedOnly(!flaggedOnly);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 shadow-sm ${
                flaggedOnly
                  ? 'bg-[#A36361]/20 text-[#A36361] border-[#A36361]/40 font-semibold'
                  : 'bg-gray-50 dark:bg-[#0B0F19] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flagged Only</span>
            </button>

            {/* Clear Filters */}
            {(searchTerm || selectedProtocol !== 'All' || selectedStatus !== 'All' || flaggedOnly) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#0B0F19] hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Data Table Layout */}
      <Card className="p-0 overflow-hidden bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
        <div className="overflow-x-auto w-full">
          {filteredLogs.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50 dark:bg-[#141823]/30">
              <div className="w-12 h-12 rounded-full bg-[#9EABA2]/15 border border-[#9EABA2]/30 flex items-center justify-center text-[#5F6F65] dark:text-[#BDD1C5]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  No network flows match your filter parameters.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  Try adjusting your IP search, clearing the protocol filters, or resetting the flagged status filter.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-300 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse min-w-[840px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#141823]/60 text-gray-600 dark:text-gray-400 font-medium select-none">
                  <th className="py-3 px-4">Flow ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Source (IP : Port)</th>
                  <th className="py-3 px-4">Destination (IP : Port)</th>
                  <th className="py-3 px-4">Protocol</th>
                  <th className="py-3 px-4">Packet Size</th>
                  <th className="py-3 px-4">Flow Duration</th>
                  <th className="py-3 px-4">Threat Score</th>
                  <th className="py-3 px-4 text-right">AI Detection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
                {paginatedLogs.map((log) => {
                  // Dynamic threat score badge color
                  let scoreBadgeClass = 'bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border-[#9EABA2]/30';
                  if (log.threatScore > 70) {
                    scoreBadgeClass = 'bg-[#A36361]/20 text-[#A36361] border-[#A36361]/30 font-bold';
                  } else if (log.threatScore > 30) {
                    scoreBadgeClass = 'bg-[#E8B298]/20 text-[#C47B5E] dark:text-[#E8B298] border-[#E8B298]/30 font-semibold';
                  }

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1e2532] transition-colors group cursor-default"
                    >
                      {/* Flow ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-gray-900 dark:text-white">
                        <span className="group-hover:text-yellow-700 dark:group-hover:text-[#EECC8C] transition-colors">
                          {log.id}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-gray-900 dark:text-gray-200 font-medium">
                          {log.srcIp}
                          <span className="text-gray-400 dark:text-gray-500 font-normal">:{log.srcPort}</span>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-gray-900 dark:text-gray-200 font-medium">
                          {log.dstIp}
                          <span className="text-gray-400 dark:text-gray-500 font-normal">:{log.dstPort}</span>
                        </div>
                      </td>

                      {/* Protocol */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300">
                          {log.protocol}
                        </span>
                      </td>

                      {/* Packet Size */}
                      <td className="py-3 px-4 font-mono text-gray-800 dark:text-gray-200">
                        {log.packetSize.toLocaleString()} B
                      </td>

                      {/* Flow Duration */}
                      <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400">
                        {log.flowDurationMs} ms
                      </td>

                      {/* Threat Score */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${scoreBadgeClass}`}>
                          {log.threatScore} / 100
                        </span>
                      </td>

                      {/* AI Detection Status */}
                      <td className="py-3 px-4 text-right">
                        <SeverityBadge level={log.status} label={log.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. Pagination Footer */}
        {filteredLogs.length > 0 && (
          <div className="p-3.5 px-5 border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#141823]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div>
              Showing{' '}
              <strong className="text-gray-900 dark:text-white font-mono">
                {Math.min((currentPage - 1) * pageSize + 1, filteredLogs.length)}
              </strong>{' '}
              to{' '}
              <strong className="text-gray-900 dark:text-white font-mono">
                {Math.min(currentPage * pageSize, filteredLogs.length)}
              </strong>{' '}
              of{' '}
              <strong className="text-gray-900 dark:text-white font-mono">
                {filteredLogs.length}
              </strong>{' '}
              telemetry records
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/5 transition flex items-center gap-1 shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-mono text-xs">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="p-1.5 px-3 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/5 transition flex items-center gap-1 shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 5. Telemetry Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Packets */}
        <Card className="p-4 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Packets Ingested</p>
            <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">
              {totalPacketsCount.toLocaleString()} Flows
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.08] text-yellow-700 dark:text-[#EECC8C]">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 2: Anomaly Rate */}
        <Card className="p-4 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Flagged Anomaly Rate</p>
            <p className="text-xl font-bold font-mono text-[#A36361] mt-1">
              {anomalyRate}%
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#A36361]/15 border border-[#A36361]/30 text-[#A36361]">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 3: Avg Flow Duration */}
        <Card className="p-4 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Flow Duration</p>
            <p className="text-xl font-bold font-mono text-[#5F6F65] dark:text-[#BDD1C5] mt-1">
              {avgFlowDuration} ms
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#9EABA2]/15 border border-[#9EABA2]/30 text-[#5F6F65] dark:text-[#BDD1C5]">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>
    </div>
  );
}
