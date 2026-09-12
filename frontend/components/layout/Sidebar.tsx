'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  Network, 
  ShieldAlert, 
  Activity,
  Settings, 
  CreditCard,
  Cpu, 
  Layers, 
  Database, 
  X 
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navItems = [
    { id: 'Overview', label: 'Overview', href: '/', icon: LayoutDashboard, badge: null },
    { id: 'Alerts', label: 'Alerts', href: '/alerts', icon: Network, badge: 'Live' },
    { id: 'Analytics', label: 'Analytics', href: '/analytics', icon: ShieldAlert, badge: '38 High' },
    { id: 'Model Performance', label: 'Model Performance', href: '/model-performance', icon: Activity, badge: '96.8%' },
    { id: 'Subscription', label: 'Subscription', href: '/subscription', icon: CreditCard, badge: 'Plans' },
    { id: 'Settings', label: 'Settings', href: '/settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white border-r border-gray-200 dark:border-white/5 flex flex-col justify-between z-50 select-none transition-all duration-300 ease-in-out md:static md:translate-x-0 md:h-screen md:shrink-0',
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
          'md:w-20 lg:w-64'
        )}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-white/5">
            <Link 
              href="/"
              onClick={onCloseMobile}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#EECC8C]/30 flex items-center justify-center shadow-sm dark:shadow-glow shrink-0 group-hover:border-[#EECC8C] transition-colors">
                <Shield className="w-5 h-5 text-gray-800 dark:text-[#EECC8C]" />
              </div>
              <div className="md:hidden lg:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Shield</span>
                  <span className="text-[#A36361] dark:text-[#EECC8C] font-bold text-lg tracking-tight">AI</span>
                </div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-500 dark:text-[#9CA3AF]">
                  Cyber Threat Defense
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A1F2B] md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-4 lg:px-6 pt-5 pb-2 md:hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
              SOC Operations
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="px-2.5 lg:px-3 space-y-1 mt-3 md:mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    onTabChange?.(item.id);
                    onCloseMobile?.();
                  }}
                  title={item.label}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-gray-100 dark:bg-[#1A1F2B] text-gray-900 dark:text-white border border-gray-300 dark:border-[#EECC8C]/40 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A1F2B]/60 border border-transparent',
                    'md:justify-center lg:justify-between'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={clsx(
                        'w-4 h-4 transition-colors shrink-0',
                        isActive
                          ? 'text-gray-900 dark:text-[#EECC8C]'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                      )}
                    />
                    <span className="md:hidden lg:inline">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={clsx(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full border md:hidden lg:inline',
                        item.badge === 'Live'
                          ? 'bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] border-[#9EABA2]/30'
                          : 'bg-[#A36361]/20 text-[#A36361] border-[#A36361]/30'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Modules */}
          <div className="px-4 lg:px-6 pt-5 pb-2 md:hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Detection Modules
            </p>
          </div>
          <div className="px-2.5 lg:px-3 space-y-1 md:hidden lg:block">
            <Link
              href="/settings"
              onClick={onCloseMobile}
              className="px-3.5 py-2 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#1A1F2B] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-3.5 h-3.5 text-gray-700 dark:text-[#EECC8C]/80" />
                <span>Isolation Forest ML</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#9EABA2] animate-pulse" />
            </Link>

            <Link
              href="/settings"
              onClick={onCloseMobile}
              className="px-3.5 py-2 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#1A1F2B] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-gray-700 dark:text-[#E8B298]/80" />
                <span>SHAP Explain Engine</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#9EABA2]" />
            </Link>

            <Link
              href="/settings"
              onClick={onCloseMobile}
              className="px-3.5 py-2 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#1A1F2B] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-3.5 h-3.5 text-gray-700 dark:text-[#9EABA2]/80" />
                <span>Flowspec Auto-Mitigate</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#EECC8C]" />
            </Link>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-white/5">
          {/* Expanded Desktop & Mobile Card */}
          <div className="bg-gray-50 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/5 rounded-xl p-3 md:hidden lg:block shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9EABA2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9EABA2]"></span>
                </span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">AI Engine Online</span>
              </div>
              <span className="text-[10px] text-gray-700 dark:text-[#EECC8C] font-mono">12ms</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
              Ingestion: 48.2k pkts/sec.
            </p>
          </div>

          {/* Tablet Icon Indicator */}
          <div className="hidden md:flex lg:hidden flex-col items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9EABA2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9EABA2]"></span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
