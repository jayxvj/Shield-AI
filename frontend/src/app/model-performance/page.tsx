'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { 
  Activity, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Cpu, 
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';

const CLASS_METRICS_DATA = [
  { class: 'DDoS', precision: 96.5, recall: 98.2, f1: 97.3 },
  { class: 'Botnet', precision: 93.8, recall: 95.4, f1: 94.6 },
  { class: 'Exploit', precision: 91.2, recall: 94.6, f1: 92.9 },
  { class: 'Scan', precision: 95.1, recall: 98.9, f1: 97.0 },
];

export default function ModelPerformancePage() {
  const CustomClassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EECC8C]" />
            <span>Attack Vector: {label}</span>
          </p>
          <div className="space-y-1 font-mono">
            <p className="flex items-center justify-between gap-4 text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#EECC8C]" /> Precision:
              </span>
              <strong className="text-yellow-700 dark:text-[#EECC8C]">{payload[0]?.value}%</strong>
            </p>
            <p className="flex items-center justify-between gap-4 text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#9EABA2]" /> Recall:
              </span>
              <strong className="text-[#5F6F65] dark:text-[#BDD1C5]">{payload[1]?.value}%</strong>
            </p>
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
            <span className="text-yellow-700 dark:text-[#EECC8C] font-medium">Model Validation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>Model Performance & Metrics</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border border-[#9EABA2]/30">
              CIC-IDS2017 Benchmark
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Quantitative evaluation of supervised XGBoost and unsupervised Isolation Forest decision boundaries.
          </p>
        </div>

        {/* Model Pipeline Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm self-start md:self-auto shrink-0">
          <Cpu className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
          <span className="font-mono text-[11px]">Ensemble: XGBoost + IsolationForest</span>
        </div>
      </div>

      {/* 2. Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        {/* Card 1: Precision */}
        <Card hoverable className="p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EECC8C]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Precision
            </span>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.08]">
              <Target className="w-4 h-4 text-[#EECC8C]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                94.2%
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +2.1%
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              Low false alarm rate across internal subnet traffic.
            </p>
          </div>
        </Card>

        {/* Card 2: Recall (Highlighted as Prioritized) */}
        <Card hoverable className="p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group min-h-[160px] border-[#9EABA2] dark:border-[#9EABA2]/70 ring-1 ring-[#9EABA2]/30 bg-gradient-to-br from-white to-[#9EABA2]/5 dark:from-[#1A1F2B] dark:to-[#9EABA2]/10">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#9EABA2]" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Recall (Sensitivity)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#9EABA2]/20 border border-[#9EABA2]/30">
              <ShieldCheck className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                96.8%
              </span>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border border-[#9EABA2]/40">
                ⭐ Prioritized
              </span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium mt-1 leading-snug">
              Critical intrusion catch rate (minimizes missed attacks).
            </p>
          </div>
        </Card>

        {/* Card 3: F1-Score */}
        <Card hoverable className="p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E8B298]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              F1-Score
            </span>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.08]">
              <BarChart2 className="w-4 h-4 text-[#E8B298]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                95.4%
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +1.8%
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              Harmonic mean balancing precision and recall.
            </p>
          </div>
        </Card>

        {/* Card 4: ROC-AUC */}
        <Card hoverable className="p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#BDD1C5]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              ROC-AUC
            </span>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.08]">
              <Activity className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                0.98
              </span>
              <span className="text-xs text-gray-400 font-mono">/ 1.00</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              Near-optimal discrimination between benign and attack classes.
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Middle Row: Confusion Matrix (Left) & Class Breakdown BarChart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Column (5 cols): Confusion Matrix */}
        <Card className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Confusion Matrix (Evaluation Sample)</span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Holdout validation test on 12,450 labeled packet flow records.
                </p>
              </div>
            </div>

            {/* Matrix Container */}
            <div className="space-y-3">
              <div className="text-[10px] uppercase font-mono text-gray-400 text-center tracking-wider">
                Predicted Threat Status
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* True Positive (TP) */}
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">True Positive (TP)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] font-mono">
                      Attacks Caught
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
                      315
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Actual Malicious ➔ Flagged Correctly
                  </p>
                </div>

                {/* False Negative (FN) - CRITICAL HIGHLIGHT */}
                <div className="p-3.5 rounded-lg bg-[#A36361]/10 border-2 border-[#A36361] relative overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#A36361]">False Negative (FN)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#A36361] text-white font-mono font-bold">
                      CRITICAL
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#A36361]">
                      12
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A36361] font-semibold">
                    Missed Attacks (Target to Minimize)
                  </p>
                </div>

                {/* False Positive (FP) */}
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">False Positive (FP)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] font-mono">
                      False Alarms
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
                      19
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Benign Traffic ➔ Flagged
                  </p>
                </div>

                {/* True Negative (TN) */}
                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">True Negative (TN)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] font-mono">
                      Normal Allowed
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
                      12,104
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Normal Baseline ➔ Allowed Clean
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Summary Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono">
            <span>FNR: <strong className="text-[#A36361]">3.67%</strong></span>
            <span>FPR: <strong className="text-yellow-700 dark:text-[#EECC8C]">0.15%</strong></span>
            <span>Accuracy: <strong className="text-gray-900 dark:text-white">99.75%</strong></span>
          </div>
        </Card>

        {/* Right Column (7 cols): Recharts BarChart Precision vs Recall */}
        <Card className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-white/10 mb-4 min-w-0">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  Precision vs Recall by Attack Classification
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Breakdown across the 4 major MITRE ATT&CK categories.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#EECC8C]" /> Precision
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#9EABA2]" /> Recall
                </span>
              </div>
            </div>

            {/* Recharts BarChart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CLASS_METRICS_DATA}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis 
                    dataKey="class" 
                    tick={{ fill: '#888888', fontSize: 11 }}
                    stroke="#88888840" 
                  />
                  <YAxis 
                    domain={[85, 100]} 
                    tick={{ fill: '#888888', fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                    stroke="#88888840" 
                  />
                  <Tooltip content={<CustomClassTooltip />} />
                  <Bar dataKey="precision" name="Precision" fill="#EECC8C" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="recall" name="Recall" fill="#9EABA2" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Highest Catch Rate: <strong className="text-gray-900 dark:text-white">Port Scan (98.9% Recall)</strong></span>
            <span className="font-mono text-yellow-700 dark:text-[#EECC8C]">Average F1: 95.45%</span>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Row: FPR vs FNR Trade-Offs Callout Card */}
      <Card className="p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 min-w-0">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-[#EECC8C]/20 text-[#EECC8C] shrink-0 mt-0.5">
            <Info className="w-5 h-5 text-yellow-700 dark:text-[#EECC8C]" />
          </div>
          <div className="space-y-2 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              False-Positive Rate (FPR) vs. False-Negative Rate (FNR) Operational Trade-Offs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/5 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A36361]" />
                  Why FNR is Prioritized (Minimizing Missed Attacks)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  In enterprise perimeter defense, a False Negative allows an unmitigated attack (such as SQLi or C2 beacons) to compromise internal subnets. Our pipeline configures the decision threshold to strictly prioritize Recall (96.8%), keeping FNR at 3.67%.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/5 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EECC8C]" />
                  Mitigating Operator Alert Fatigue (FPR Control)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Excessive False Positives overload Tier-2 SOC analysts. By utilizing XGBoost supervised filtering on top of Isolation Forest anomaly scores, the False Positive Rate is maintained at a low 0.15% across 12k+ daily packet streams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
