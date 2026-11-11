import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Heart, Activity } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';

interface StandardSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof ShieldCheck;
  image: string;
}

const slides: StandardSlide[] = [
  {
    id: 'sterilization',
    title: 'Multi-Stage Instrument Sterilization',
    subtitle: 'Cross-Infection Prevention',
    description: 'Every clinical instrument is thoroughly cleaned, sealed in individual sterilization pouches, and autoclaved at high temperature prior to each patient consultation.',
    icon: ShieldCheck,
    image: clinicConfig.equipmentImage,
  },
  {
    id: 'diagnostics',
    title: 'High-Resolution Clinical Diagnostics',
    subtitle: 'Accurate Digital Assessment',
    description: 'We utilize digital intraoral assessment tools that allow detailed visibility of cavities, hairline tooth fractures, and gum margins with minimal radiation.',
    icon: Activity,
    image: clinicConfig.clinicImage,
  },
  {
    id: 'comfort',
    title: 'Gentle & Anxiety-Reduced Approach',
    subtitle: 'Patient-Centered Comfort',
    description: 'From calm, modern lounge seating to gentle local anesthetic techniques, our priority is ensuring visits are as comfortable and stress-free as possible.',
    icon: Heart,
    image: clinicConfig.heroPosterUrl,
  },
  {
    id: 'conservative',
    title: 'Conservative Tooth Preservation',
    subtitle: 'Long-Term Oral Health',
    description: 'We emphasize minimally invasive procedures aimed at saving your natural tooth enamel and bone structure whenever clinically feasible.',
    icon: Sparkles,
    image: clinicConfig.clinicImage,
  },
];

export const ClinicalStandardsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  const current = slides[currentIndex];
  const IconComponent = current.icon;

  return (
    <section
      className="py-16 sm:py-24 bg-neutral-900 text-white w-full border-t border-neutral-800"
      aria-label="Clinical Standards and Patient Safety"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl text-left space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full bg-sky-950 text-sky-300 border border-sky-800">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Patient Safety & Care Standards
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Clinical Quality & Hygiene Protocols
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 font-normal">
              A disciplined medical approach focused on safety, sterility, and patient comfort at Mansehra Dental Lounge.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3 shrink-0 pb-2">
            <button
              onClick={prevSlide}
              aria-label="Previous standard slide"
              className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-sky-400 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-mono text-sm text-neutral-400 px-2" aria-live="polite">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next standard slide"
              className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-sky-400 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Slide Card Container */}
        <div
          ref={containerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Clinical safety standards"
          className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 p-6 sm:p-10 lg:p-12 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[380px]"
            >
              {/* Text Area */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 shadow-md">
                  <IconComponent className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    {current.subtitle}
                  </span>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                    {current.title}
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
                  {current.description}
                </p>

                <div className="pt-2 text-xs text-neutral-400 font-medium">
                  Verified protocol at Biotech Medical Center, Mansehra.
                </div>
              </div>

              {/* Image Area */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[4/3] sm:aspect-[16/10] bg-neutral-900 shadow-lg">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-neutral-800/60 mt-6">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-sky-400'
                    : 'w-2.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
