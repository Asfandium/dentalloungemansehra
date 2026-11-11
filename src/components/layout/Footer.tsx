import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowUpRight, Navigation } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { EXACT_SERVICE_NAMES } from '../../config/servicesData';
import { useAppointmentModal } from '../../context/AppointmentModalContext';

export const Footer: React.FC = () => {
  const { openModal } = useAppointmentModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Column 1: Clinic Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <img
                src={clinicConfig.logoImage}
                alt={`${clinicConfig.name} Logo`}
                className="w-12 h-12 rounded-2xl object-contain bg-white p-1 shadow-md"
              />
              <span className="font-serif-editorial text-2xl font-extrabold text-white tracking-tight">
                {clinicConfig.name}
              </span>
            </Link>

            <p className="text-base text-slate-400 leading-relaxed font-medium">
              Comprehensive dental consultations, restorative dentistry, cosmetics, and orthodontics in a comfortable, modern setting in Mansehra.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-300 bg-slate-900 hover:bg-[#000075] hover:text-white px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <span>Explore Treatments</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={clinicConfig.mapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif-editorial text-base font-bold text-white tracking-wider uppercase">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-base font-medium">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Our Practice
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">
                  Services & Pricing Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Services (Strict Order) */}
          <div className="space-y-4">
            <h3 className="font-serif-editorial text-base font-bold text-white tracking-wider uppercase">
              Featured Services
            </h3>
            <ul className="space-y-2.5 text-base text-slate-400 font-medium">
              {EXACT_SERVICE_NAMES.slice(0, 6).map((serviceName) => (
                <li key={serviceName}>
                  <button
                    onClick={() => openModal(serviceName)}
                    className="hover:text-sky-300 transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span>{serviceName}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-sky-400 font-bold hover:underline text-sm inline-block pt-1">
                  View All 10 Services & Prices →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-4">
            <h3 className="font-serif-editorial text-base font-bold text-white tracking-wider uppercase">
              Location & Hours
            </h3>
            <div className="space-y-3 text-base text-slate-400 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{clinicConfig.address}, {clinicConfig.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <a href={`tel:${clinicConfig.phoneRaw}`} className="hover:text-white transition-colors font-bold text-white">
                  {clinicConfig.phone}
                </a>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-slate-800 text-sm">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">{clinicConfig.openingHours.weekdays}</p>
                  <p className="text-slate-400">{clinicConfig.openingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
          <p>
            © {currentYear} {clinicConfig.name}. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl text-xs text-slate-400">
            Biotech Medical Center, opposite King Abdullah Teaching Hospital, Mansehra, Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
};
