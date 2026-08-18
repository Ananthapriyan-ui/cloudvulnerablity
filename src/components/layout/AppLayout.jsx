import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex cyber-bg-grid">
      {/* Sidebar Navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right column: Navbar + content + footer */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Navbar Header */}
        <Navbar collapsed={collapsed} />

        {/* Main Page Body */}
        <main className="flex-1 pt-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto py-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
