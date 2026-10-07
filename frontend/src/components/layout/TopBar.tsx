'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  SlidersHorizontal,
  Menu,
  Settings,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface TopBarProps {
  onSearchChange?: (term: string) => void;
  searchValue?: string;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearchChange,
  searchValue = '',
  onToggleMobileMenu,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);

  return (
    <header className="h-16 shrink-0 w-full z-30 border-b flex items-center justify-between px-4 md:px-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 0 var(--border), 0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      {/* Left: Hamburger + Logo + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg md:hidden shrink-0 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand mark (mobile) */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #06B6D4)' }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search IP, alert ID, signature..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-lg pl-10 pr-12 py-2 text-xs transition-all duration-200 outline-none"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(59,130,246,0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <kbd className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 pl-3 shrink-0">
        {/* Live Stream Badge */}
        <button
          onClick={() => setIsLive(!isLive)}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          style={{
            background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: isLive ? '#10B981' : '#EF4444',
          }}
        >
          <span className="relative flex h-2 w-2">
            {isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#10B981' }} />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: isLive ? '#10B981' : '#EF4444' }} />
          </span>
          <span className="tracking-wide uppercase font-mono text-[11px]">
            {isLive ? 'LIVE' : 'PAUSED'}
          </span>
          <span className="font-mono text-[11px] opacity-60">| 10 Gbps</span>
        </button>

        {/* Theme Toggle (switch style) */}
        <ThemeToggle />

        <div className="h-6 w-px hidden sm:block" style={{ background: 'var(--border)' }} />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: '#EF4444' }}>
              3
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl z-50 p-2 text-xs animate-slide-up"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <div className="px-3 py-2 border-b flex items-center justify-between font-semibold"
                style={{ borderColor: 'var(--border)' }}>
                <span>Recent Alerts</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171' }}>3 New</span>
              </div>
              <div className="py-1 space-y-0.5">
                {[
                  { label: 'Critical: SYN Flood Blocked', ip: '198.51.100.44', color: '#F87171', bg: 'rgba(239,68,68,0.06)', time: '2m ago' },
                  { label: 'Warning: Port Scan Detected', ip: '45.33.32.156', color: '#FBBF24', bg: 'rgba(251,191,36,0.06)', time: '6m ago' },
                  { label: 'Mitigated: SQLi Payload Dropped', ip: '203.0.113.88', color: '#34D399', bg: 'rgba(52,211,153,0.06)', time: '14m ago' },
                ].map((n, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg cursor-pointer transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = n.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: n.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
                      {n.label}
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>{n.ip} • {n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 cursor-pointer p-1 rounded-lg transition-colors"
            role="button"
            tabIndex={0}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
              AV
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>ADMIN</p>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>SOC Analyst</p>
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 p-1 text-xs animate-slide-up"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              {[
                { icon: User, label: 'My Profile' },
                { icon: Settings, label: 'SOC Preferences' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  {label}
                </button>
              ))}
              <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
              <button onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-red-400"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
