import { PageHead } from '../components/layout/PageHead';
import { SectionHeading } from '../components/common/SectionHeading';
import { DoctorProfileSection } from '../components/home/DoctorProfileSection';
import { ClinicalStandardsCarousel } from '../components/about/ClinicalStandardsCarousel';
import { clinicConfig } from '../config/clinicConfig';
import { useAppointmentModal } from '../context/AppointmentModalContext';
import { Button } from '../components/common/Button';
import { Calendar, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  const { openModal } = useAppointmentModal();

  const values = [
    {
      title: 'Honest Clinical Ethics',
      desc: 'We recommend only medically necessary treatments, explaining diagnosis and price estimates with complete clarity.',
      icon: ShieldCheck,
    },
    {
      title: 'Comfort-Centered Environment',
      desc: 'Our modern lounge setting and gentle localized anesthesia protocols ensure patients feel relaxed at every stage.',
      icon: Heart,
    },
    {
      title: 'Continuous Quality & Sterility',
      desc: 'Strict infection-control procedures and multi-stage autoclave sterilization protect every patient who visits.',
      icon: Award,
    },
  ];

  return (
    <>
      <PageHead
        title={`About Us | ${clinicConfig.name} Mansehra`}
        description={`Learn about ${clinicConfig.name} in Mansehra. Led by Dr. Usama Ismail Abbasi (BDS - Ayub Medical College) RDS at Biotech Medical Center, opposite King Abdullah Teaching Hospital.`}
      />

      {/* 1. Distinct Editorial About Hero Banner */}
      <section className="py-16 sm:py-24 bg-neutral-950 text-white relative overflow-hidden w-full border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src={clinicConfig.clinicImage}
            alt="Mansehra Dental Lounge reception"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/60" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-sky-950 text-sky-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-sky-800"
          >
            Practice Philosophy & Vision
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Dedicated to Modern, Ethical Dentistry in Mansehra
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-300 leading-relaxed font-normal"
          >
            At <strong className="text-white font-bold">{clinicConfig.name}</strong>, we believe every patient deserves compassionate, high-standard dental care in a clean and relaxing clinic environment opposite King Abdullah Teaching Hospital.
          </motion.p>
        </div>
      </section>

      {/* 2. Core Care Philosophy */}
      <section className="py-16 sm:py-24 bg-white w-full">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <SectionHeading
            badge="Our Guiding Principles"
            title="Why Patients Trust Mansehra Dental Lounge"
            subtitle="Built on clinical integrity, patient comfort, and continuous quality standards."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-left space-y-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#000075] shadow-xs">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif-editorial text-2xl font-bold text-neutral-900">{v.title}</h3>
                  <p className="text-neutral-600 text-base leading-relaxed font-normal">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Lead Practitioner Profile (Rebalanced with light sky-blue treatment) */}
      <DoctorProfileSection />

      {/* 4. Clinical Standards & Patient Safety Carousel */}
      <ClinicalStandardsCarousel />

      {/* 5. Modern Facilities Gallery */}
      <section className="py-16 sm:py-24 bg-white border-t border-neutral-200 w-full">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <SectionHeading
            badge="Clinic Environment"
            title="Our Modern Facility in Mansehra"
            subtitle="Equipped with modern dental operatory chairs, digital intraoral devices, and strict infection control standards."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-200 group h-72">
              <img
                src={clinicConfig.clinicImage}
                alt="Treatment room at Mansehra Dental Lounge"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-sm font-bold shadow-md">
                  Treatment Operatory
                </span>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-200 group h-72">
              <img
                src={clinicConfig.equipmentImage}
                alt="Digital diagnostics equipment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-sm font-bold shadow-md">
                  Clinical Equipment
                </span>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-200 group h-72">
              <img
                src={clinicConfig.heroPosterUrl}
                alt="Patient consultation suite"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-sm font-bold shadow-md">
                  Consultation Lounge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contextual Closing CTA Banner */}
      <section className="py-16 bg-neutral-950 text-white text-center w-full border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold">
            Ready to Visit Mansehra Dental Lounge?
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto">
            Schedule your check-up or consultation with our team at Biotech Medical Center, opposite King Abdullah Teaching Hospital.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openModal()}
              leftIcon={<Calendar className="w-5 h-5" />}
            >
              Book an Appointment
            </Button>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="border-neutral-600 bg-neutral-900 text-white hover:bg-neutral-800"
              >
                View Location & Contact
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
