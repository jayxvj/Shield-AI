'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Layers,
  X,
  Radio,
  Cpu,
  Database,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV = [
  { id: 'Live Monitor', label: 'Live Sentinel', href: '#live-stream', icon: Radio, badge: 'LIVE' },
  { id: 'Telemetry', label: 'Telemetry KPIs', href: '#kpis', icon: LayoutDashboard, badge: null },
  { id: 'Timeline', label: 'Traffic Timeline', href: '#timeline', icon: Activity, badge: null },
  { id: 'Threats', label: 'Threat Stream', href: '#threat-feed', icon: ShieldAlert, badge: null },
  { id: 'Roadmap', label: 'Improvement Plan', href: '#roadmap', icon: Layers, badge: null },
];

const MODULES = [
  { label: 'Isolation Forest ML', icon: Cpu, status: 'green' },
  { label: 'SHAP Explain Engine', icon: Layers, status: 'blue' },
  { label: 'Flowspec Auto-Mitigate', icon: Database, status: 'green' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 flex flex-col justify-between z-50 select-none transition-all duration-300 ease-in-out md:static md:translate-x-0 md:h-screen md:shrink-0',
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
          'md:w-[72px] lg:w-64'
        )}
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div>
          {/* Branding */}
          <div className="h-16 flex items-center justify-between px-4 lg:px-5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <Link href="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)',
                  boxShadow: '0 0 16px rgba(59,130,246,0.4)',
                }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="md:hidden lg:block">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>Shield</span>
                  <span className="font-bold text-base tracking-tight" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Cyber Threat Defense
                </p>
              </div>
            </Link>
            <button onClick={onCloseMobile} className="p-1.5 rounded-lg md:hidden transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section label */}
          <div className="px-4 lg:px-5 pt-5 pb-2 md:hidden lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              SOC Operations
            </p>
          </div>

          {/* Nav */}
          <nav className="px-2.5 space-y-0.5 mt-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => { onTabChange?.(item.id); onCloseMobile?.(); }}
                  title={item.label}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group md:justify-center lg:justify-between'
                  )}
                  style={isActive ? {
                    background: 'rgba(59,130,246,0.1)',
                    borderLeft: '2px solid #3B82F6',
                    color: 'var(--accent-blue)',
                    boxShadow: '0 0 12px rgba(59,130,246,0.12)',
                  } : {
                    color: 'var(--text-muted)',
                    borderLeft: '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="md:hidden lg:inline">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono md:hidden lg:inline"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Modules */}
          <div className="px-4 lg:px-5 pt-5 pb-2 md:hidden lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Detection Modules
            </p>
          </div>
          <div className="px-2.5 space-y-0.5 md:hidden lg:block">
            {MODULES.map(({ label, icon: Icon, status }) => (
              <div key={label} className="px-3 py-2 rounded-xl flex items-center justify-between text-xs cursor-default transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </div>
                <span className={`status-led ${status}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="p-3 lg:p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="rounded-xl p-3 md:hidden lg:block"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="status-led green" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Engine Online</span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--accent-cyan)' }}>12ms</span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Ingestion: 48.2k pkts/sec</p>
          </div>
          {/* Tablet icon */}
          <div className="hidden md:flex lg:hidden flex-col items-center p-2 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid var(--border)' }}>
            <span className="status-led green" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
