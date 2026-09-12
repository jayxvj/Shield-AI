'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Database, 
  Key, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  Server,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  // 1. State Setup: Detection & Explainability Modules
  const [isoForestEnabled, setIsoForestEnabled] = useState(true);
  const [xgboostEnabled, setXgboostEnabled] = useState(true);
  const [shapEnabled, setShapEnabled] = useState(true);

  // 2. State Setup: Risk & Mitigation Thresholds
  const [autoMitigateThreshold, setAutoMitigateThreshold] = useState(90);
  const [anomalySensitivity, setAnomalySensitivity] = useState(75);

  // 3. State Setup: SIEM & Firewall Integrations
  const [elasticsearchUrl, setElasticsearchUrl] = useState('https://siem.shield-ai.internal:9200');
  const [firewallApiKey, setFirewallApiKey] = useState('sk-fwall-90382-prod-flowspec-auth');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Save Success Toast */}
      {isSaved && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 bg-white dark:bg-[#1A1F2B] border border-[#9EABA2] dark:border-[#BDD1C5]/50 text-gray-900 dark:text-white px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="w-8 h-8 rounded-lg bg-[#9EABA2]/20 border border-[#BDD1C5]/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#5F6F65] dark:text-[#BDD1C5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#5F6F65] dark:text-[#BDD1C5]">Configuration Synchronized</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              ML thresholds, modules, and SIEM connectors saved to central SOC daemon.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/[0.05]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <span>AI Engine Configuration & Settings</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage telemetry ingest thresholds, ML classifiers, XAI explainability engines, and border SIEM integrations.
          </p>
        </div>

        {/* Engine Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-700 dark:text-gray-300 shadow-sm self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-yellow-700 dark:text-[#EECC8C]" />
          <span className="font-mono text-[11px]">SOC Engine: v2.4.1 (Active)</span>
        </div>
      </div>

      {/* Grid Layout: 2 Columns on desktop */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Card 1: Detection & Explainability Modules */}
        <Card className="p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
            <Cpu className="w-4 h-4 text-yellow-700 dark:text-[#EECC8C]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              Detection & Explainability Modules
            </h2>
          </div>

          <div className="space-y-4">
            {/* Module 1: Isolation Forest */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06]">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  Isolation Forest (Zero-Day Anomaly Detection)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Unsupervised packet outlier profiling for novel zero-day exploits.
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isoForestEnabled}
                onClick={() => setIsoForestEnabled(!isoForestEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EECC8C]/50 ${
                  isoForestEnabled ? 'bg-[#9EABA2]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle Isolation Forest</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isoForestEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Module 2: XGBoost */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06]">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  XGBoost (Threat Classification)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Supervised gradient boosted classifier mapped to CIC-IDS attack vectors.
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={xgboostEnabled}
                onClick={() => setXgboostEnabled(!xgboostEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EECC8C]/50 ${
                  xgboostEnabled ? 'bg-[#9EABA2]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle XGBoost</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    xgboostEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Module 3: SHAP */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06]">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  SHAP (Decision Explainability)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Real-time Shapley additive feature attribution for analyst audit trails.
                </p>
              </div>

              {/* Custom Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={shapEnabled}
                onClick={() => setShapEnabled(!shapEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EECC8C]/50 ${
                  shapEnabled ? 'bg-[#9EABA2]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle SHAP</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    shapEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Card 2: Risk & Mitigation Thresholds */}
        <Card className="p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
            <SlidersHorizontal className="w-4 h-4 text-yellow-700 dark:text-[#EECC8C]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              Risk & Mitigation Thresholds
            </h2>
          </div>

          <div className="space-y-5">
            {/* Slider 1: Auto-Mitigate Threshold */}
            <div className="space-y-2 p-3.5 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="auto-mitigate-slider" 
                  className="text-xs font-semibold text-gray-900 dark:text-white"
                >
                  Auto-Mitigate Threshold
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 dark:bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] border border-yellow-200 dark:border-[#EECC8C]/30">
                  {autoMitigateThreshold}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Only execute defensive playbooks automatically if AI confidence exceeds this value.
              </p>
              <input
                id="auto-mitigate-slider"
                type="range"
                min="0"
                max="100"
                value={autoMitigateThreshold}
                onChange={(e) => setAutoMitigateThreshold(Number(e.target.value))}
                className="w-full accent-[#EECC8C] cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0% (Aggressive)</span>
                <span>50%</span>
                <span>100% (Strict)</span>
              </div>
            </div>

            {/* Slider 2: Anomaly Sensitivity */}
            <div className="space-y-2 p-3.5 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="anomaly-sensitivity-slider" 
                  className="text-xs font-semibold text-gray-900 dark:text-white"
                >
                  Anomaly Sensitivity
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-[#E8B298]/20 text-orange-800 dark:text-[#E8B298] border border-orange-200 dark:border-[#E8B298]/30">
                  {anomalySensitivity}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Higher sensitivity generates more alerts but may increase false positives.
              </p>
              <input
                id="anomaly-sensitivity-slider"
                type="range"
                min="0"
                max="100"
                value={anomalySensitivity}
                onChange={(e) => setAnomalySensitivity(Number(e.target.value))}
                className="w-full accent-[#EECC8C] cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0% (Low Noise)</span>
                <span>50%</span>
                <span>100% (Maximum Detection)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: SIEM & Firewall Integrations (Spans full width on desktop) */}
        <Card className="md:col-span-2 p-5 sm:p-6 bg-white dark:bg-[#1A1F2B] border-gray-200 dark:border-white/[0.07] space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.06]">
            <Server className="w-4 h-4 text-yellow-700 dark:text-[#EECC8C]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              SIEM & Firewall Integrations
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Elasticsearch URL */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="elasticsearch-url" 
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Elasticsearch Endpoint URL
                </label>
                <div className="relative">
                  <Database className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="elasticsearch-url"
                    type="text"
                    value={elasticsearchUrl}
                    onChange={(e) => setElasticsearchUrl(e.target.value)}
                    placeholder="https://siem.internal:9200"
                    className="w-full bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-md pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#EECC8C] transition shadow-sm font-mono"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Target cluster for long-term telemetry storage and Kibana threat feeds.
                </p>
              </div>

              {/* Edge Firewall API Key */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="firewall-api-key" 
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Edge Firewall API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="firewall-api-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={firewallApiKey}
                    onChange={(e) => setFirewallApiKey(e.target.value)}
                    placeholder="sk-fwall-..."
                    className="w-full bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-md pl-9 pr-10 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#EECC8C] transition shadow-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Used by Flowspec engine to automatically announce perimeter drop rules.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#5F6F65] dark:text-[#BDD1C5]" />
                <span>Encrypted with AES-256 GCM on local SOC master vault.</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#EECC8C] text-black hover:opacity-90 font-semibold px-5 py-2.5 rounded-lg transition shadow-sm text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
