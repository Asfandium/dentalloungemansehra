import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, Smile } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { clinicConfig } from '../../config/clinicConfig';

export const PatientCareSection: React.FC = () => {
  const commitments = [
    {
      title: 'Hygienic Sterilization Protocol',
      desc: 'All instruments undergo multi-stage ultrasonic cleaning and autoclave sterilization before every usage.',
      icon: <ShieldCheck className="w-6 h-6 text-[#000075]" />,
    },
    {
      title: 'Gentle & Anesthesia-Supported Care',
      desc: 'We prioritize patient comfort and gentle administration of localized anesthesia to eliminate procedure discomfort.',
      icon: <Heart className="w-6 h-6 text-[#000075]" />,
    },
    {
      title: 'Clear Patient Communication',
      desc: 'No surprising procedures. Our clinical practitioner explains diagnoses, treatment choices, and fee estimates beforehand.',
      icon: <Sparkles className="w-6 h-6 text-[#000075]" />,
    },
    {
      title: 'Comfortable Modern Environment',
      desc: 'A serene, welcoming lounge setting designed to make patients feel relaxed and cared for in Mansehra.',
      icon: <Smile className="w-6 h-6 text-[#000075]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#000075] via-[#000060] to-[#000045] text-white w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <SectionHeading
              badge="Clinical Standards & Patient Safety"
              title="Patient-Centered Dental Care in Mansehra"
              subtitle={`At ${clinicConfig.name}, we hold clinical hygiene, patient comfort, and clinical ethics to the highest standards.`}
              align="left"
              dark
            />

            <div className="space-y-4 pt-2">
              {commitments.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/95 text-slate-900 shadow-lg border border-blue-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/40 group">
              <img
                src={clinicConfig.equipmentImage}
                alt="Dental Lounge Mansehra facility setup"
                className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/95 text-white text-sm border border-blue-500/50 backdrop-blur-md shadow-xl">
                <p className="font-extrabold text-white text-base">Dental Lounge Clinical Hygiene Standard</p>
                <p className="text-blue-200 text-xs sm:text-sm mt-0.5">Adhering to international cross-infection control guidelines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
