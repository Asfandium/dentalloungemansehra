import React from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, Navigation } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { Button } from '../common/Button';

// Recognizable official WhatsApp brand SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.164-3.488-8.414" />
  </svg>
);

export const ContactInfo: React.FC = () => {
  const { openModal } = useAppointmentModal();

  return (
    <div className="w-full flex flex-col space-y-8 text-left">
      <div>
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#000075] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 border border-blue-200">
          Direct Patient Contact
        </span>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900">
          Get in Touch with {clinicConfig.name}
        </h2>
        <p className="text-slate-600 text-base sm:text-lg font-medium mt-2">
          Located at Biotech Medical Center, opposite King Abdullah Teaching Hospital in Mansehra. Reach out for consultations, inquiries, or scheduling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Address Card */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm flex items-start gap-4 hover:border-blue-400 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#000075] shrink-0 mt-0.5">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg">Clinic Location</h3>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mt-1">
              {clinicConfig.address}, {clinicConfig.city}, {clinicConfig.province}
            </p>
            <div className="mt-3">
              <a
                href={clinicConfig.mapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#000075] hover:underline bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Pinpoint on Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Timings Card */}
        <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-md flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#000075] border border-blue-400/50 flex items-center justify-center text-[#BFDBFE] shrink-0 mt-0.5">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Operating Hours</h3>
            <div className="text-sm sm:text-base text-slate-200 space-y-1.5 mt-1 font-medium">
              <p className="text-[#BFDBFE] font-bold">{clinicConfig.openingHours.weekdays}</p>
              <p className="text-slate-400 text-xs sm:text-sm">{clinicConfig.openingHours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Telephone Card */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm flex items-start gap-4 hover:border-blue-400 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#000075] shrink-0 mt-0.5">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Direct Telephone</h3>
            <p className="text-base sm:text-lg text-slate-800 font-bold mt-1">
              <a href={`tel:${clinicConfig.phoneRaw}`} className="text-[#000075] hover:underline">
                {clinicConfig.phone}
              </a>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Monday to Saturday 3 PM – 9 PM</p>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm flex items-start gap-4 hover:border-emerald-400 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
            <WhatsAppIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">WhatsApp Inquiries</h3>
            <p className="text-base sm:text-lg text-emerald-700 font-bold mt-1">
              <a
                href={`https://wa.me/${clinicConfig.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {clinicConfig.whatsapp}
              </a>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Instant message support & inquiries</p>
          </div>
        </div>

        {/* Email Card (Full Width on 2-col) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm flex items-start gap-4 hover:border-blue-400 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#000075] shrink-0 mt-0.5">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Email Correspondence</h3>
            <p className="text-base sm:text-lg text-slate-800 font-bold mt-1">
              <a href={`mailto:${clinicConfig.email}`} className="text-[#000075] hover:underline">
                {clinicConfig.email}
              </a>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Official clinic queries & records</p>
          </div>
        </div>
      </div>

      {/* Single Disciplined Booking Action */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={() => openModal()}
          leftIcon={<Calendar className="w-5 h-5" />}
          className="w-full sm:w-auto shadow-lg"
        >
          Book Appointment Online
        </Button>
      </div>
    </div>
  );
};
