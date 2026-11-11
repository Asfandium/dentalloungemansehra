import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, Clock } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#000075]" />,
      title: 'Hospital-Grade Sterilization',
      desc: 'Autoclaved instruments and strict infection prevention protocols for every single patient.',
    },
    {
      icon: <Heart className="w-7 h-7 text-[#000075]" />,
      title: 'Pain-Minimized Approach',
      desc: 'Gentle local anesthesia techniques and calm atmosphere designed to soothe dental anxiety.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-[#000075]" />,
      title: 'Modern Clinical Equipment',
      desc: 'Digital intraoral imagery and precision tools for accurate diagnostics and durable results.',
    },
    {
      icon: <Clock className="w-7 h-7 text-[#000075]" />,
      title: 'Punctual & Honest Care',
      desc: 'Respecting your schedule with transparent treatment plans and zero unexpected pressure.',
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col text-left space-y-3 p-5 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                {item.icon}
              </div>
              <h3 className="font-serif-editorial text-xl font-extrabold text-slate-900">
                {item.title}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
