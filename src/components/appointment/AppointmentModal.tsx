import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, PhoneCall, Clock } from 'lucide-react';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { clinicConfig } from '../../config/clinicConfig';
import { AppointmentForm } from './AppointmentForm';
import { Button } from '../common/Button';

export const AppointmentModal: React.FC = () => {
  const { isOpen, preselectedService, closeModal } = useAppointmentModal();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setIsSuccess(false);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  const handleClose = () => {
    closeModal();
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Container Sheet */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="appointment-modal-title"
                    className="font-serif-editorial text-lg sm:text-xl font-bold text-slate-900 leading-snug"
                  >
                    {isSuccess ? 'Request Submitted' : 'Book an Appointment'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {clinicConfig.name} • {clinicConfig.city}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center flex flex-col items-center max-w-md mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h3 className="font-serif-editorial text-2xl font-bold text-slate-900 mb-2">
                    Appointment Request Received
                  </h3>

                  <p className="text-slate-600 text-base leading-relaxed mb-6">
                    Thank you. Our reception team will contact you shortly to confirm your appointment time and date details.
                  </p>

                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left text-xs sm:text-sm space-y-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                      <span><strong>Hours:</strong> {clinicConfig.openingHours.weekdays}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-teal-700 shrink-0" />
                      <span><strong>Urgent Inquiries:</strong> {clinicConfig.phone}</span>
                    </div>
                  </div>

                  <Button variant="primary" onClick={handleClose} className="w-full sm:w-auto px-8">
                    Done & Return to Website
                  </Button>
                </motion.div>
              ) : (
                <AppointmentForm initialService={preselectedService} onSuccess={handleSuccess} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
