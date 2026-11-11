import React from 'react';
import { motion } from 'framer-motion';
import {
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
  ArrowRight,
  Tag
} from 'lucide-react';
import type { DentalService } from '../../config/servicesData';
import { getFullImageUrl } from '../../utils/imageUrl';

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-5 h-5 text-sky-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-sky-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-sky-400" />,
  Activity: <Activity className="w-5 h-5 text-sky-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-sky-400" />,
  Sun: <Sun className="w-5 h-5 text-sky-400" />,
  Heart: <Heart className="w-5 h-5 text-sky-400" />,
  Layers: <Layers className="w-5 h-5 text-sky-400" />,
  Anchor: <Anchor className="w-5 h-5 text-sky-400" />,
  Smile: <Smile className="w-5 h-5 text-sky-400" />,
};

interface ServiceCardProps {
  service: DentalService;
  onExplore?: (service: DentalService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onExplore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col justify-between h-full min-h-[490px] rounded-3xl overflow-hidden border border-neutral-700/80 bg-neutral-900 text-white shadow-xl hover:shadow-2xl hover:border-sky-500/80 transition-all duration-300"
    >
      {/* Top Media Image Banner (100% bright, zero black overlay) */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950 shrink-0">
        <img
          src={getFullImageUrl(service.image)}
          alt={service.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />

        {/* Badges on top of image with subtle backdrop */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md">
            {iconMap[service.iconName] || <Stethoscope className="w-5 h-5 text-sky-400" />}
          </div>
          <span className="font-mono text-xs font-bold text-sky-300 bg-slate-950/85 backdrop-blur-md border border-sky-800/80 px-3 py-1 rounded-full shadow-md">
            #{String(service.orderNumber).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Card Content with generous breathing room */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          {/* Service Title */}
          <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white mb-2.5 group-hover:text-sky-300 transition-colors leading-snug">
            {service.name}
          </h3>

          {/* Approved Pricing Presentation */}
          <div className="mb-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs font-bold shadow-xs">
            <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{service.priceDisplay}</span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-neutral-300 leading-relaxed mb-4 font-normal line-clamp-2">
            {service.shortDescription}
          </p>

          {/* Key Benefits */}
          <ul className="space-y-1.5 mb-5 text-xs text-neutral-400">
            {service.generalBenefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action: Contextual Learn More / Explore Details */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3 mt-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {service.category}
          </span>

          {onExplore ? (
            <button
              onClick={() => onExplore(service)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-sky-300 hover:text-white border border-neutral-700 hover:border-sky-500 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Explore Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <span className="text-xs text-neutral-500">Available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
