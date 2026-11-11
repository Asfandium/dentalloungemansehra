import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { Button } from '../common/Button';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const { openModal } = useAppointmentModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services & Pricing', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-black text-white border-b border-neutral-800 ${
        isScrolled
          ? 'py-2.5 shadow-xl bg-black/95 backdrop-blur-md'
          : 'py-3.5 sm:py-4 shadow-md'
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Clinic Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl p-1"
            aria-label="Mansehra Dental Lounge Home"
          >
            <img
              src={clinicConfig.logoImage}
              alt="Mansehra Dental Lounge Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="font-serif-editorial text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-none">
                {clinicConfig.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (White Text) */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-base font-semibold rounded-xl transition-all ${
                    active
                      ? 'text-white bg-neutral-800 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${clinicConfig.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 hover:text-white rounded-xl border border-neutral-700 transition-colors"
              aria-label={`Call clinic at ${clinicConfig.phone}`}
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>{clinicConfig.phone}</span>
            </a>

            {/* Primary Appointment Booking CTA */}
            <Button
              variant="primary"
              size="md"
              onClick={() => openModal()}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu & Call Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={`tel:${clinicConfig.phoneRaw}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 rounded-lg border border-neutral-700"
              aria-label="Call clinic"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Call</span>
            </a>

            <button
              onClick={onMobileMenuToggle}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-xl text-white hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
