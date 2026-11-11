import { motion } from 'framer-motion';
import { Award, GraduationCap, CheckCircle2, User, MapPin, Phone } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { Button } from '../common/Button';

export const DoctorProfileSection: React.FC = () => {
  const areasOfExpertise = [
    'Comprehensive Oral Examination & Diagnostics',
    'Pain-Free Root Canal Treatments (RCT)',
    'Cosmetic Smile Design & Bleaching',
    'Dental Implant Restorations & Prosthetic Crowns',
    'Gentle Extractions & Oral Surgery',
    'Preventive Scaling & Periodontal Care',
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-neutral-200/80 w-full overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Doctor Portrait Asset */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-100 bg-neutral-100 group"
            >
              <img
                src={clinicConfig.doctorImage}
                alt={`Dr. ${clinicConfig.doctorName}`}
                className="w-full h-[460px] sm:h-[540px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Verified Practitioner Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-sky-200 shadow-xl text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 text-[#000075] flex items-center justify-center font-bold text-lg shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-xl font-extrabold text-neutral-900 leading-tight">
                      Dr. {clinicConfig.doctorName}
                    </h3>
                    <p className="text-sm text-sky-800 font-bold mt-0.5">
                      {clinicConfig.qualification}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Balanced Editorial Biography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full bg-sky-50 text-[#000075] border border-sky-200 mb-3">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                Lead Dental Practitioner
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Dr. {clinicConfig.doctorName}
              </h2>
              <p className="text-base sm:text-lg font-bold text-sky-800 mt-1">
                {clinicConfig.qualification}
              </p>
            </div>

            {/* Factual Professional Bio */}
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-normal">
              Dr. {clinicConfig.doctorName} graduated with a Bachelor of Dental Surgery (BDS) from <strong className="text-neutral-900 font-semibold">Ayub Medical College</strong> and is a Registered Dental Surgeon (RDS). He leads the clinical team at Mansehra Dental Lounge, delivering gentle, evidence-based treatments ranging from preventative hygiene to complex endodontics and dental restorations.
            </p>

            {/* Factual Practice Meta Box with Sky-Blue Treatment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-5 bg-sky-50/60 border border-sky-200 rounded-2xl text-sm sm:text-base text-neutral-800">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900 font-bold">Registration & Education:</strong>
                  <span>BDS (Ayub Medical College) RDS</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900 font-bold">Consultation Location:</strong>
                  <span>Biotech Medical Center, Mansehra</span>
                </div>
              </div>
            </div>

            {/* Areas of Expertise Checklist */}
            <div className="w-full space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">
                Core Clinical Practice Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-neutral-800 font-medium">
                {areasOfExpertise.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Action (Disciplined Booking CTAs) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a href={`tel:${clinicConfig.phoneRaw}`}>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Phone className="w-4 h-4 text-sky-700" />}
                >
                  Contact Clinic: {clinicConfig.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
