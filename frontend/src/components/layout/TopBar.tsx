'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  SlidersHorizontal,
  Menu,
  User,
  Settings,
  LogOut
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
  onToggleMobileMenu
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);

  return (
    <header className="h-16 shrink-0 w-full z-30 bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/5 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Hamburger + Search Input */}
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Hamburger Menu Toggle on Mobile (< 768px) */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg bg-gray-100 dark:bg-[#1A1F2B] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 md:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IP, alert ID, signature or asset..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 focus:border-[#EECC8C] dark:focus:border-[#EECC8C]/50 rounded-lg pl-10 pr-12 md:pr-14 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#EECC8C]/40 transition-all duration-200"
          />
          <div className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5">
            <kbd className="bg-gray-200 dark:bg-[#0B0F19] text-gray-600 dark:text-gray-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-gray-300 dark:border-white/10">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 pl-3 shrink-0">
        {/* Live Stream Toggle Badge */}
        <button
          onClick={() => setIsLive(!isLive)}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-xs transition-all duration-200 cursor-pointer shadow-sm"
          title={isLive ? 'Click to Pause Live Ingestion' : 'Click to Resume Live Stream'}
        >
          <span className="relative flex h-2 w-2">
            {isLive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9EABA2] dark:bg-[#BDD1C5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9EABA2] dark:bg-[#BDD1C5]"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A36361]"></span>
            )}
          </span>
          <span className={`font-medium text-[11px] tracking-wide uppercase transition-colors ${
            isLive ? 'text-[#5F6F65] dark:text-[#BDD1C5]' : 'text-[#A36361]'
          }`}>
            {isLive ? 'LIVE STREAM' : 'PAUSED'}
          </span>
          <span className="text-gray-400 text-[11px] font-mono">| 10 Gbps</span>
        </button>

        {/* Settings Icon Button wrapped in Next.js Link */}
        <Link
          href="/settings"
          className="hidden sm:inline-flex relative p-2 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm"
          aria-label="Configuration & Settings"
          title="AI Configuration & Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Link>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-lg bg-white dark:bg-[#1A1F2B] hover:bg-gray-100 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-sm outline-none focus:outline-none focus:ring-0 border-transparent"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A36361] rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-white dark:border-[#0B0F19]">
              3
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 z-50 p-2 text-xs text-gray-900 dark:text-white animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-white/10 flex items-center justify-between font-semibold">
                <span>Recent Alerts</span>
                <span className="text-[10px] bg-[#A36361]/20 text-[#A36361] px-1.5 py-0.5 rounded font-mono">3 New</span>
              </div>
              <div className="py-1 space-y-1">
                <div className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 text-[#A36361] font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A36361]" />
                    Critical: SYN Flood Blocked
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-mono">198.51.100.44 • 2m ago</p>
                </div>
                <div className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 text-orange-600 dark:text-[#E8B298] font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B298]" />
                    Warning: Port Scan Detected
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-mono">45.33.32.156 • 6m ago</p>
                </div>
                <div className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 text-[#5F6F65] dark:text-[#BDD1C5] font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BDD1C5]" />
                    Mitigated: SQLi Payload Dropped
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-mono">203.0.113.88 • 14m ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Component */}
        <ThemeToggle />

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

        {/* SOC Analyst Profile Dropdown Container */}
        <div className="relative">
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 pl-1 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1F2B]/60 transition"
            role="button"
            tabIndex={0}
            aria-label="User Profile"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-[#1A1F2B] dark:to-[#2E364A] border border-[#EECC8C]/40 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-[#EECC8C] shadow-sm">
                AV
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#9EABA2] dark:bg-[#BDD1C5] border-2 border-white dark:border-[#0B0F19]" />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>ADMIN PANEL</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#EECC8C]/20 text-yellow-800 dark:text-[#EECC8C] rounded font-mono font-normal">
                  SOC
                </span>
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Analyst & Defense AI</p>
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 z-50 p-1 text-xs text-gray-900 dark:text-white animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-white/10 font-semibold xl:hidden">
                <p className="text-xs text-gray-900 dark:text-white">ADMIN</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Analyst & Defense AI</p>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>My Profile</span>
              </button>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
                <span>SOC Preferences</span>
              </Link>
              <div className="my-1 border-t border-gray-200 dark:border-white/10" />
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#0B0F19] transition flex items-center gap-2 text-[#A36361] hover:text-[#A36361]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
