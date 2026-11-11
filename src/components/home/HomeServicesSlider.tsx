import React, { useRef, useState, useEffect } from 'react';
import { fallbackServicesData, type DentalService } from '../../config/servicesData';
import { getDentalServices } from '../../services/servicesApi';
import { ServiceCard } from '../services/ServiceCard';
import { SectionHeading } from '../common/SectionHeading';
import { ServiceDetailModal } from '../services/ServiceDetailModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HomeServicesSlider: React.FC = () => {
  const [services, setServices] = useState<DentalService[]>(fallbackServicesData);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getDentalServices()
      .then((data) => {
        if (isMounted && data) {
          setServices(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white w-full overflow-hidden relative">
      {/* Background Subtle Radial Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <SectionHeading
            badge="Full Screen Service Portfolio"
            title="Comprehensive Dental Treatments at Dental Lounge"
            subtitle="Explore our 10 specialized clinical procedures. Swipe or scroll to view details & pricing."
            align="left"
            dark
          />

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0 pb-4 md:pb-14">
            <button
              onClick={scrollLeft}
              aria-label="Scroll services left"
              className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={scrollRight}
              aria-label="Scroll services right"
              className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Full-Length Scroll Slider Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-8 pt-2 scroll-smooth w-full"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="w-[300px] sm:w-[360px] lg:w-[400px] shrink-0"
            >
              <ServiceCard
                service={service}
                onExplore={(srv) => setSelectedService(srv)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
