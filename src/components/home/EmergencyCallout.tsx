import { Phone, Calendar, AlertCircle } from 'lucide-react';
import { clinicConfig } from '../../config/clinicConfig';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import { Button } from '../common/Button';

export const EmergencyCallout: React.FC = () => {
  const { openModal } = useAppointmentModal();

  return (
    <section className="py-14 bg-[#000075] text-white relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(#60A5FA_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-blue-400/40 backdrop-blur-md shadow-2xl">
          <div className="flex items-start gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#000075] border border-blue-400/50 text-[#BFDBFE] flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Experiencing Acute Tooth Pain or Urgent Dental Issues?
              </h3>
              <p className="text-slate-200 text-base max-w-3xl font-medium">
                Dental Lounge reserves emergency appointment slots for severe toothaches, trauma, and urgent dental concerns in Mansehra.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <a href={`tel:${clinicConfig.phoneRaw}`} className="w-full sm:w-auto">
              <Button
                variant="call"
                size="lg"
                leftIcon={<Phone className="w-5 h-5 text-[#93C5FD]" />}
                className="w-full sm:w-auto"
              >
                {clinicConfig.phone}
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={() => openModal()}
              leftIcon={<Calendar className="w-5 h-5 text-[#BFDBFE]" />}
              className="w-full sm:w-auto border-blue-400/60 text-white bg-[#000075]/80 hover:bg-[#000055]"
            >
              Book Priority Slot
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
