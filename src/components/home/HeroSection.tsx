import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, MapPin, Clock, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  const { openModal } = useAppointmentModal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white min-h-[580px] lg:min-h-[660px] flex items-center py-12 sm:py-16 lg:py-20">
      {/* Background Video Layer with Graceful Image Poster Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!prefersReducedMotion && !videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={clinicConfig.heroPosterUrl}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center scale-105"
            aria-hidden="true"
          >
            <source src={clinicConfig.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={clinicConfig.heroPosterUrl}
            alt="Mansehra Dental Lounge facility"
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Light directional gradient behind text only, no dark film over media */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl flex flex-col items-start text-left space-y-6">
          {/* Clinic Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/90 border border-sky-400/40 text-sky-200 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md"
          >
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Biotech Medical Center, Mansehra</span>
          </motion.div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Modern, Compassionate Dental Care in Mansehra.
          </motion.h1>

          {/* Concise Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-neutral-200 leading-relaxed font-normal max-w-2xl"
          >
            Welcome to <strong className="text-white font-bold">{clinicConfig.name}</strong>. Located opposite King Abdullah Teaching Hospital, we offer comprehensive routine check-ups, root canals, fillings, scaling, dentures, implants, and orthodontics in a calm lounge environment.
          </motion.p>

          {/* Quick Hours Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-700/80 backdrop-blur-sm"
          >
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Clinic Timings: <strong className="text-white font-semibold">{clinicConfig.openingHours.weekdays}</strong></span>
          </motion.div>

          {/* Primary Appointment CTA + Secondary Call Action */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
          >
            {/* Primary Booking Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => openModal()}
              leftIcon={<Calendar className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-xl"
            >
              Book an Appointment
            </Button>

            {/* Secondary Call Button */}
            <a href={`tel:${clinicConfig.phoneRaw}`} className="w-full sm:w-auto">
              <Button
                variant="call"
                size="lg"
                leftIcon={<Phone className="w-5 h-5 text-sky-300" />}
                className="w-full sm:w-auto"
                aria-label={`Call clinic at ${clinicConfig.phone}`}
              >
                Call: {clinicConfig.phone}
              </Button>
            </a>
          </motion.div>

          {/* Clinical Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-xl text-neutral-300 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Sterile Protocols</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Patient Comfort</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Transparent Care</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
