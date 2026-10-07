'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-14 h-7 rounded-full bg-gray-200 dark:bg-[#0D1526]" />;

  const isDark = (resolvedTheme || theme) === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none group"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1D4ED8, #0EA5E9)'
          : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
        borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(148,163,184,0.4)',
        boxShadow: isDark ? '0 0 12px rgba(59,130,246,0.35)' : 'none',
      }}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Sliding knob */}
      <span
        className="absolute flex items-center justify-center w-5 h-5 rounded-full shadow-md transition-all duration-300"
        style={{
          left: isDark ? 'calc(100% - 1.5rem)' : '2px',
          background: isDark ? '#fff' : '#1e40af',
        }}
      >
        {isDark
          ? <Moon className="w-3 h-3 text-blue-600" />
          : <Sun className="w-3 h-3 text-white" />
        }
      </span>
    </button>
  );
};

export default ThemeToggle;
