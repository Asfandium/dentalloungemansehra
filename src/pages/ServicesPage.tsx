import React, { useState, useEffect } from 'react';
import { PageHead } from '../components/layout/PageHead';
import { fallbackServicesData, type DentalService } from '../config/servicesData';
import { getDentalServices } from '../services/servicesApi';
import { clinicConfig } from '../config/clinicConfig';
import { getFullImageUrl } from '../utils/imageUrl';
import { useAppointmentModal } from '../context/AppointmentModalContext';
import { Button } from '../components/common/Button';
import { ServiceDetailModal } from '../components/services/ServiceDetailModal';
import {
  Calendar,
  CheckCircle2,
  UserCheck,
  Stethoscope,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Sparkles,
  Sun,
  Heart,
  Layers,
  Anchor,
  Smile,
  Tag,
  Info,
  Phone,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-6 h-6 text-[#000075]" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-[#000075]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#000075]" />,
  Activity: <Activity className="w-6 h-6 text-[#000075]" />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#000075]" />,
  Sun: <Sun className="w-6 h-6 text-[#000075]" />,
  Heart: <Heart className="w-6 h-6 text-[#000075]" />,
  Layers: <Layers className="w-6 h-6 text-[#000075]" />,
  Anchor: <Anchor className="w-6 h-6 text-[#000075]" />,
  Smile: <Smile className="w-6 h-6 text-[#000075]" />,
};

export const ServicesPage: React.FC = () => {
  const { openModal } = useAppointmentModal();
  const [services, setServices] = useState<DentalService[]>(fallbackServicesData);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [exploreService, setExploreService] = useState<DentalService | null>(null);

  // Dynamic pricing & image API client
  useEffect(() => {
    let isMounted = true;
    getDentalServices().then((data) => {
      if (isMounted) {
        setServices(data);
      }
    }).catch(() => {
      // Fallback already assigned
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Preventative', 'Restorative', 'Cosmetics', 'Orthodontics'];

  // Filter services while strictly preserving their 1..10 order
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <>
      <PageHead
        title={`Dental Services & Pricing | ${clinicConfig.name} Mansehra`}
        description={`Explore dental treatment pricing at Mansehra Dental Lounge: routine check-ups, extractions, fillings, root canals, scaling, whitening, dentures, bridges, implants, and braces.`}
      />

      {/* Header Banner */}
      <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-950 text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-blue-700"
          >
            Services & Transparent Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif-editorial text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Dental Treatments & Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-300 leading-relaxed font-medium"
          >
            Explore our 10 core clinical dental treatments provided at {clinicConfig.name}, opposite King Abdullah Teaching Hospital in Mansehra.
          </motion.p>
        </div>
      </section>

      {/* Category Filter & Service Directory */}
      <section className="py-12 sm:py-20 bg-slate-50 w-full">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#000075] text-white shadow-lg shadow-blue-950/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat} {cat === 'All' ? `(${services.length})` : ''}
              </button>
            ))}
          </div>

          {/* Pricing Disclaimer Note */}
          <div className="mb-12 p-5 rounded-2xl bg-sky-50 border border-sky-200 text-slate-800 text-sm sm:text-base flex items-start gap-4 shadow-xs">
            <Info className="w-6 h-6 text-[#000075] shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              <strong>Transparent Fee Estimates:</strong> Listed prices represent standard treatment ranges at {clinicConfig.name}. Exact treatment plans and final fees are confirmed after an initial in-person clinical examination.
            </p>
          </div>

          {/* Detailed Service Panels in EXACT specified order (1 to 10) with increased breathing room & contrast */}
          <div className="space-y-10 sm:space-y-12">
            {filteredServices.map((service, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12 min-h-[440px] ${
                    isEven
                      ? 'bg-white border-slate-200/90'
                      : 'bg-slate-100/70 border-slate-300/80'
                  }`}
                >
                  {/* Visual Imagery Panel (Bright, vivid clinical photo with zero muddy overlay) */}
                  <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-slate-900 text-white">
                    <img
                      src={getFullImageUrl(service.image)}
                      alt={service.name}
                      className="absolute inset-0 w-full h-full object-cover object-center hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />
                    {/* Gentle gradient at bottom only for text legibility, media stays 100% visible and bright */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Top Order Badge & Icon */}
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                        {iconMap[service.iconName] || <Stethoscope className="w-6 h-6 text-sky-300" />}
                      </div>
                      <span className="font-mono text-xs font-bold text-sky-200 bg-slate-950/80 backdrop-blur-md border border-sky-600/60 px-3.5 py-1 rounded-full shadow-md">
                        Service #{String(service.orderNumber).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Bottom Metadata Over Photo */}
                    <div className="relative z-10 mt-auto pt-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1 block drop-shadow-md">
                        {service.category}
                      </span>
                      <h3 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  {/* Editorial Details & Approved Pricing Presentation */}
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
                    <div className="space-y-4">
                      {/* Approved Pricing Box */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Treatment Fee Range
                          </span>
                          <p className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                            {service.priceDisplay}
                          </p>
                          {service.priceNote && (
                            <p className="text-xs text-emerald-800 font-medium mt-0.5">
                              {service.priceNote}
                            </p>
                          )}
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Tag className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                        {service.shortDescription}
                      </p>

                      {/* Target Patient Guidance */}
                      <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-100 flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-[#000075] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wide text-[#000075] block mb-0.5">
                            Recommended For
                          </span>
                          <p className="text-sm sm:text-base text-slate-800 font-medium">
                            {service.whoItIsFor}
                          </p>
                        </div>
                      </div>

                      {/* General Clinical Benefits */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                          General Clinical Benefits
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base text-slate-800 font-medium">
                          {service.generalBenefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Disciplined Action: Contextual "Explore Details" */}
                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
                      <button
                        onClick={() => setExploreService(service)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#000075] text-white text-sm sm:text-base font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <span>Explore Procedure Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <span className="text-xs text-slate-500 font-semibold">
                        Consultation available at Mansehra clinic
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Principal Conversion Section at bottom of Services page */}
          <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-3xl bg-slate-950 text-white text-center border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
                Patient Consultations
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-white">
                Ready to Schedule Your Dental Visit?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-medium">
                Book a consultation slot with Dr. Usama Ismail Abbasi at {clinicConfig.name}, opposite King Abdullah Teaching Hospital Mansehra.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openModal()}
                  leftIcon={<Calendar className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-lg"
                >
                  Book an Appointment
                </Button>
                <a
                  href={`tel:${clinicConfig.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#000075] text-[#BFDBFE] hover:bg-[#000045] font-bold text-base border border-blue-700 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call {clinicConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail Modal */}
      <ServiceDetailModal
        service={exploreService}
        onClose={() => setExploreService(null)}
      />
    </>
  );
};
