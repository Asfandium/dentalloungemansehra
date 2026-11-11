import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { AppointmentModal } from '../appointment/AppointmentModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-800 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Sticky Top Header */}
      <Navbar onMobileMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {/* Global Appointment Modal Dialog */}
      <AppointmentModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};
