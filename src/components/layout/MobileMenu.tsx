import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { Button } from '../common/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { openModal } = useAppointmentModal();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services & Pricing', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleBookClick = () => {
    onClose();
    openModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="lg:hidden sticky top-[62px] z-40 bg-neutral-950 text-white border-b border-neutral-800 shadow-2xl overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Navigation Links (White text on black background) */}
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-lg font-bold transition-colors ${
                      isActive
                        ? 'bg-neutral-800 text-white border-l-4 border-blue-500'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-5 h-5 text-neutral-500" />
                  </Link>
                );
              })}
            </nav>

            {/* Quick Contact & Hours Box */}
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-3 text-sm text-neutral-300 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{clinicConfig.address}, {clinicConfig.city}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{clinicConfig.openingHours.weekdays}</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <a href={`tel:${clinicConfig.phoneRaw}`} className="font-bold text-white text-base">
                  {clinicConfig.phone}
                </a>
              </div>
            </div>

            {/* Book Appointment CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleBookClick}
              className="w-full shadow-lg"
              leftIcon={<Calendar className="w-5 h-5" />}
            >
              Book Appointment
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
