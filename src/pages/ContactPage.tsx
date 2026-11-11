import React from 'react';
import { PageHead } from '../components/layout/PageHead';
import { ContactInfo } from '../components/contact/ContactInfo';
import { MapEmbed } from '../components/contact/MapEmbed';
import { clinicConfig } from '../config/clinicConfig';
import { motion } from 'framer-motion';

export const ContactPage: React.FC = () => {
  return (
    <>
      <PageHead
        title={`Contact & Location | ${clinicConfig.name} Mansehra`}
        description={`Contact ${clinicConfig.name} in Mansehra. Address: Biotech Medical Center opposite King Abdullah Teaching Hospital. Phone: 0348 2226228, WhatsApp, and Google Maps directions.`}
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
            {clinicConfig.name}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif-editorial text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Contact & Location Information
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-300 leading-relaxed font-medium"
          >
            Find our exact location, reach out directly via phone or WhatsApp, or book a consultation online.
          </motion.p>
        </div>
      </section>

      {/* Contact Details & Inquiry Section */}
      <section className="py-14 sm:py-20 bg-slate-50 w-full border-b border-slate-200">
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfo />
        </div>
      </section>

      {/* Standalone Full-Width Map Section (Requirement 9.C) */}
      <section className="py-14 sm:py-24 bg-white w-full">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#000075] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              Interactive Map Experience
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900">
              Visit Us in Mansehra
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">
              We are situated directly opposite King Abdullah Teaching Hospital on Biotech Medical Center's premises.
            </p>
          </div>

          <MapEmbed />
        </div>
      </section>
    </>
  );
};
