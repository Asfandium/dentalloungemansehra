import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, UserCheck, Calendar, Tag } from 'lucide-react';
import type { DentalService } from '../../config/servicesData';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { getFullImageUrl } from '../../utils/imageUrl';
import { Button } from '../common/Button';

interface ServiceDetailModalProps {
  service: DentalService | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const { openModal } = useAppointmentModal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && service) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  const handleBookClick = () => {
    onClose();
    openModal(service.name);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto"
        >
          {/* Top Banner Image & Header (Bright & clear, no black overlay) */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
            <img
              src={getFullImageUrl(service.image)}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            {/* Subtle bottom gradient only behind title */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-xs font-bold uppercase tracking-wider">
                #{String(service.orderNumber).padStart(2, '0')} • {service.category}
              </span>
              <h2 id="service-detail-title" className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-white">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-700 max-h-[60vh] overflow-y-auto">
            {/* Pricing Card Banner */}
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Estimated Treatment Fee
                </span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                  {service.priceDisplay}
                </p>
                {service.priceNote && (
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">{service.priceNote}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Tag className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Treatment Overview
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
                {service.fullDescription}
              </p>
            </div>

            <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wide">
                <UserCheck className="w-5 h-5 text-blue-700" />
                <span>Who Is This For?</span>
              </div>
              <p className="text-sm sm:text-base text-blue-950 leading-relaxed font-medium">
                {service.whoItIsFor}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Benefits & Outcomes
              </h3>
              <ul className="space-y-2.5 text-base text-slate-800">
                {service.generalBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
              Mansehra Dental Lounge
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button variant="outline" size="md" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleBookClick}
                leftIcon={<Calendar className="w-5 h-5" />}
              >
                Book This Treatment
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
