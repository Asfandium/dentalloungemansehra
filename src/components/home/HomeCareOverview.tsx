import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { Button } from '../common/Button';

export const HomeCareOverview: React.FC = () => {
  const careHighlights = [
    {
      title: 'Evidence-Based Treatments',
      desc: 'Accurate clinical diagnostics and gentle procedures tailored to your personal oral health needs.',
    },
    {
      title: 'Transparent Treatment Planning',
      desc: 'Clear explanations and upfront fee estimates before any treatment commences.',
    },
    {
      title: 'Comfortable Modern Lounge',
      desc: 'Designed for a relaxing, anxiety-free experience for adults, children, and seniors in Mansehra.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80 w-full overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Balanced Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full bg-sky-50 text-[#000075] border border-sky-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Clinic Care & Philosophy
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Dedicated to Gentle, High-Standard Dentistry
              </h2>
            </div>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              At <strong className="text-neutral-900 font-semibold">{clinicConfig.name}</strong>, we take a preventive, conservative approach to dental health. Our clinic is equipped with digital intraoral diagnostics, modern sterilization units, and ergonomic treatment suites designed to ensure long-term oral well-being.
            </p>

            {/* Clean Feature List without Cluttered Boxes */}
            <div className="space-y-4 w-full pt-1">
              {careHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-left">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#000075] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#000075]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">{item.title}</h3>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contextual Alternative CTA (Disciplined Booking CTAs) */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link to="/services">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Services & Pricing
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="ghost"
                  size="md"
                >
                  Learn About Our Practice
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Clean Balanced Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-200 bg-neutral-100 group">
              <img
                src={clinicConfig.clinicImage}
                alt="Mansehra Dental Lounge clinical facility"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-neutral-950/90 backdrop-blur-md text-white text-xs sm:text-sm border border-neutral-700 shadow-xl">
                <p className="font-bold text-white text-sm">Biotech Medical Center, Mansehra</p>
                <p className="text-neutral-300 text-xs mt-0.5">Opposite King Abdullah Teaching Hospital</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
