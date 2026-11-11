import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';

export const MapEmbed: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-white font-bold text-xl sm:text-2xl font-serif-editorial">
            <MapPin className="w-6 h-6 text-sky-400 shrink-0" />
            <span>Biotech Medical Center, Mansehra</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            Opposite King Abdullah Teaching Hospital, Mansehra, Khyber Pakhtunkhwa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={clinicConfig.mapsDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#BFDBFE] bg-[#000075] hover:bg-[#000055] px-5 py-3 rounded-2xl shadow-lg border border-blue-600 transition-all"
          >
            <Navigation className="w-4 h-4 text-sky-300" />
            <span>Get Directions</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </div>
      </div>

      {/* Full-width responsive map container */}
      <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl bg-slate-100">
        <iframe
          title={`Google Map pinpoint location of ${clinicConfig.name} in Mansehra`}
          src={clinicConfig.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
