'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { mockThreatVectors, ThreatVector } from '@/lib/mock-data';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Activity, 
  ChevronRight, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function ThreatIntelPage() {
  const [selectedVector, setSelectedVector] = useState<ThreatVector>(mockThreatVectors[0]);
  const [hasCopied, setHasCopied] = useState(false);

  // Copy playbook snippet handler
  const handleCopyCode = () => {
    if (selectedVector?.mitigationPlaybook?.codeSnippet) {
      navigator.clipboard.writeText(selectedVector.mitigationPlaybook.codeSnippet);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  // Custom Tooltip for SHAP horizontal bar chart
  const CustomShapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isTop = selectedVector.shapFeatures[0]?.feature === data.feature;
      return (
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: isTop ? '#EECC8C' : '#E8B298' }}
            />
            <span className="font-semibold text-gray-900 dark:text-white">{data.feature}</span>
          </div>
          <div className="space-y-1 font-mono text-gray-600 dark:text-gray-300">
            <p>SHAP Importance Score: <strong className="text-gray-900 dark:text-white">{data.impact}</strong></p>
            <p>Attribution Weight: <strong className="text-yellow-700 dark:text-[#EECC8C]">{(data.impact * 100).toFixed(0)}%</strong></p>
            {isTop && (
              <p className="text-[10px] text-yellow-800 dark:text-[#EECC8C] font-sans font-semibold mt-1">
                ⭐ Primary Decision Driver
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <span>Threat Intelligence & AI Explainability</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            MITRE ATT&CK taxonomy signatures, SHAP attribution trees, and automated mitigation playbooks.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
          <span className="font-mono text-[11px]">{mockThreatVectors.length} Active Signatures Profiled</span>
        </div>
      </div>

      {/* 2. Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (1 span) - Attack Signatures List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A36361]" />
              <span>Attack Signatures</span>
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">Select to Inspect</span>
          </div>

          <div className="space-y-2.5">
            {mockThreatVectors.map((vector) => {
              const isSelected = selectedVector.id === vector.id;

              return (
                <div
                  key={vector.id}
                  onClick={() => setSelectedVector(vector)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white dark:bg-[#1e2532] border-gray-300 dark:border-[#EECC8C] ring-2 ring-[#EECC8C]/40 shadow-md'
                      : 'bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-[#1f2636]'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedVector(vector);
                    }
                  }}
                >
                  {/* Active Left Indicator Bar */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#EECC8C]" />
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {vector.id}
                      </span>
                      <h3 className={`text-sm font-bold tracking-tight transition-colors ${
                        isSelected 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-800 dark:text-gray-200 group-hover:text-yellow-700 dark:group-hover:text-[#EECC8C]'
                      }`}>
                        {vector.name}
                      </h3>
                    </div>

                    <SeverityBadge level={vector.severity.toLowerCase()} label={vector.severity} />
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                    {vector.category}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/[0.06] text-[11px]">
                    <span className="text-gray-500 dark:text-gray-400 font-mono">
                      {vector.frequency}
                    </span>
                    <span className={`inline-flex items-center gap-1 font-medium transition-colors ${
                      isSelected 
                        ? 'text-yellow-700 dark:text-[#EECC8C]' 
                        : 'text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'
                    }`}>
                      <span>Deep Dive</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 spans) - Threat Deep Dive */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card: Selected Threat Overview */}
          <Card className="p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B0F19] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 font-semibold">
                    {selectedVector.id}
                  </span>
                  <span className="text-xs text-yellow-700 dark:text-[#EECC8C] font-medium">
                    {selectedVector.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {selectedVector.name}
                </h2>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <SeverityBadge level={selectedVector.severity.toLowerCase()} label={`${selectedVector.severity} Severity`} />
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10">
                  {selectedVector.frequency}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedVector.description}
            </p>
          </Card>

          {/* Section 1: Explainability Section (SHAP Horizontal BarChart) */}
          <Card className="p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-yellow-700 dark:text-[#EECC8C]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                  AI Decision Logic (SHAP Feature Importance)
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Top feature highlighted in accent yellow (#EECC8C)
              </span>
            </div>

            {/* Horizontal Recharts Bar Chart */}
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={selectedVector.shapFeatures}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="currentColor" 
                    className="text-gray-200 dark:text-white/[0.05]" 
                    horizontal={false} 
                  />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(val) => `${Math.round(val * 100)}%`}
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'currentColor', className: 'text-gray-200 dark:text-white/10' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={150}
                  />
                  <Tooltip content={<CustomShapTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                  <Bar 
                    dataKey="impact" 
                    radius={[0, 4, 4, 0]}
                    animationDuration={800}
                  >
                    {selectedVector.shapFeatures.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#EECC8C' : '#E8B298'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/[0.07] text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#EECC8C]" />
                  <span className="text-gray-700 dark:text-gray-300">Top Driver (Primary Anomaly Factor)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#E8B298]" />
                  <span className="text-gray-700 dark:text-gray-300">Secondary Correlated Features</span>
                </div>
              </div>
              <span className="font-mono text-[11px] hidden sm:inline">Isolation Forest + SHAP Kernel</span>
            </div>
          </Card>

          {/* Section 2: Mitigation Playbook Section */}
          <Card className="p-5 sm:p-6 bg-gray-50 dark:bg-[#111827] border-gray-200 dark:border-white/10 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  Automated Mitigation Playbook
                </h3>
              </div>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border border-[#9EABA2]/30">
                Ready for Zero-Touch Deployment
              </span>
            </div>

            {/* Playbook Action Explanation */}
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedVector.mitigationPlaybook.action}
            </p>

            {/* Code Snippet Box with Copy Button */}
            <div className="relative bg-gray-100 dark:bg-[#0B0F19] border border-gray-300 dark:border-white/10 rounded-xl p-4 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-white/[0.08] text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-700 dark:text-[#EECC8C]" />
                  <span>Enforcement Script (Perimeter / Kernel / WAF)</span>
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#1A1F2B] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                  aria-label="Copy code to clipboard"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5]" />
                      <span className="text-[#5F6F65] dark:text-[#BDD1C5] font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto text-gray-900 dark:text-[#EECC8C] font-mono leading-relaxed py-1 scrollbar-thin">
                <code>{selectedVector.mitigationPlaybook.codeSnippet}</code>
              </pre>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5]" />
              <span>
                Simulated execution via <strong>Flowspec BGP daemon & iptables subsystem</strong>.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
