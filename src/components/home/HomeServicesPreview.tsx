import React, { useState, useEffect } from 'react';
import { fallbackServicesData, type DentalService } from '../../config/servicesData';
import { getDentalServices } from '../../services/servicesApi';
import { SectionHeading } from '../common/SectionHeading';
import { ServiceCard } from '../services/ServiceCard';
import { ServiceDetailModal } from '../services/ServiceDetailModal';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomeServicesPreview: React.FC = () => {
  const [services, setServices] = useState<DentalService[]>(fallbackServicesData);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);

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

  return (
    <section className="py-16 sm:py-24 bg-slate-50 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeading
          badge="Services & Fee Guide"
          title="Comprehensive Dental Treatments at Mansehra Dental Lounge"
          subtitle="From routine check-ups & scaling to root canals, dentures, implants, and aligners at our Mansehra clinic."
          align="center"
        />

        {/* 10 Services Grid maintaining strict specified ordering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onExplore={(srv) => setSelectedService(srv)}
            />
          ))}
        </div>

        {/* Explore All Link Banner */}
        <div className="mt-14 text-center">
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5 text-blue-700" />}
              className="border-blue-200 hover:border-blue-500"
            >
              Explore Full Treatment Directory & Pricing
            </Button>
          </Link>
        </div>
      </div>

      {/* Service Detail Modal Drawer */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
