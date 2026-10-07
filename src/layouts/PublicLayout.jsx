import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AboutModal } from '../components/common/AboutModal';

export const PublicLayout = () => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onOpenAbout={() => setAboutModalOpen(true)} />

      <main className="flex-1">
        <Outlet context={{ openAboutModal: () => setAboutModalOpen(true) }} />
      </main>

      <Footer onOpenAbout={() => setAboutModalOpen(true)} />

      {/* Global About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
};
