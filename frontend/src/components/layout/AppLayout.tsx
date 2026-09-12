'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('Overview');
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB] dark:bg-[#0B0F19] text-[#111827] dark:text-white transition-colors duration-200">
      {/* Sidebar on the left */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Right-side wrapper */}
      <div className="flex flex-col flex-1 w-full h-full min-w-0 overflow-hidden">
        {/* Top Bar at the top */}
        <TopBar 
          searchValue={searchValue} 
          onSearchChange={setSearchValue}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full min-w-0">
          <div className="max-w-[1600px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
