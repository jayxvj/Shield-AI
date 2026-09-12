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
  Zap,
  BarChart3
} from 'lucide-react';

export default function AnalyticsPage() {
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
    <div className="space-y-6 pb-8 min-w-0">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>SOC Central</span>
            <span>/</span>
            <span className="text-yellow-700 dark:text-[#EECC8C] font-medium">Threat Intelligence Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <span>Threat Intelligence & AI Analytics</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            MITRE ATT&CK taxonomy signatures, SHAP attribution trees, and automated mitigation playbooks.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm self-start md:self-auto shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
          <span className="font-mono text-[11px]">{mockThreatVectors.length} Active Signatures Profiled</span>
        </div>
      </div>

      {/* 2. Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-w-0">
        {/* Left Column (1 span) - Attack Signatures List */}
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A36361]" />
              <span>Attack Signatures</span>
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">Select to Inspect</span>
          </div>

          <div className="space-y-2.5">
            {mockThreatVectors.map((vector) => {
              const isSelected = selectedVector.id === vector.id;

              return (
                <Card
                  key={vector.id}
                  hoverable
                  onClick={() => setSelectedVector(vector)}
                  className={`p-4 cursor-pointer transition-all duration-200 relative overflow-hidden min-w-0 ${
                    isSelected
                      ? 'border-[#EECC8C] dark:border-[#EECC8C]/80 ring-1 ring-[#EECC8C]/40 bg-gradient-to-r from-gray-50/90 to-white dark:from-[#1A1F2B] dark:to-[#161A24] shadow-md'
                      : 'hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EECC8C]" />
                  )}

                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                          {vector.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                        {vector.category}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <SeverityBadge level={vector.severity} />
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#EECC8C] translate-x-0.5' : 'text-gray-400'}`} />
                    </div>
                  </div>

                  {/* Frequency footer */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#EECC8C]" />
                      {vector.frequency}
                    </span>
                    <span>ID: {vector.id}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 spans) - Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {/* Card 1: Vector Overview & MITRE Context */}
          <Card className="p-5 sm:p-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-white/10 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-yellow-700 dark:text-[#EECC8C] font-mono mb-1">
                  <span>MITRE ATT&CK MATRIX</span>
                  <span>•</span>
                  <span>{selectedVector.id}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5 truncate">
                  <span>{selectedVector.name}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Category: {selectedVector.category}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <SeverityBadge level={selectedVector.severity} />
                <span className="text-xs px-2.5 py-1 rounded bg-gray-100 dark:bg-[#0B0F19] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 font-mono">
                  {selectedVector.frequency}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span>Threat Signature Description</span>
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#0B0F19] p-3.5 rounded-lg border border-gray-200 dark:border-white/5">
                {selectedVector.description}
              </p>
            </div>
          </Card>

          {/* Card 2: AI Explainability (SHAP Feature Importance Chart) */}
          <Card className="p-5 sm:p-6 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EECC8C]/20 text-[#EECC8C]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    SHAP Attribution Tree (Decision Weights)
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Feature impact values calculated by the TreeExplainer module for this classification.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B0F19] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hidden sm:inline-block">
                Top 5 Impact Weights
              </span>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedVector.shapFeatures}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888820" />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                    tick={{ fill: '#888888', fontSize: 10 }}
                    stroke="#88888840"
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    tick={{ fill: '#888888', fontSize: 11 }}
                    stroke="#88888840"
                    width={150}
                  />
                  <Tooltip content={<CustomShapTooltip />} />
                  <Bar
                    dataKey="impact"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
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

            {/* Driver explanation pill */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EECC8C]" />
                Primary Driver: <strong className="text-gray-900 dark:text-white">{selectedVector.shapFeatures[0]?.feature}</strong>
              </span>
              <span className="font-mono text-[11px] text-yellow-700 dark:text-[#EECC8C]">
                +{(selectedVector.shapFeatures[0]?.impact * 100).toFixed(1)}% model certainty
              </span>
            </div>
          </Card>

          {/* Card 3: Automated Mitigation Playbook */}
          <Card className="p-5 sm:p-6 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Defensive Mitigation Playbook
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Recommended command sequence for automated BGP / firewall policy enforcement.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0B0F19] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#9EABA2]" />
                    <span className="text-[#9EABA2] font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Playbook</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Strategy Summary */}
            <div className="mb-4">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {selectedVector.mitigationPlaybook.action}
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="bg-[#0B0F19] text-[#9EABA2] font-mono text-xs p-4 rounded-lg border border-[#EECC8C]/20 overflow-x-auto shadow-inner leading-relaxed">
                <code>{selectedVector.mitigationPlaybook.codeSnippet}</code>
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
