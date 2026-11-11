import { PageHead } from '../components/layout/PageHead';
import { HeroSection } from '../components/home/HeroSection';
import { TrustBar } from '../components/home/TrustBar';
import { HomeCareOverview } from '../components/home/HomeCareOverview';
import { PatientCareSection } from '../components/home/PatientCareSection';
import { EmergencyCallout } from '../components/home/EmergencyCallout';
import { clinicConfig } from '../config/clinicConfig';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageHead
        title={`${clinicConfig.name} | Modern Dental Clinic in Mansehra`}
        description={`Welcome to ${clinicConfig.name} in Mansehra opposite King Abdullah Teaching Hospital. Providing routine check-ups, root canals, fillings, scaling, whitening, dentures, implants, and braces.`}
      />

      {/* 1. First Hero Slide: Background Video Hero with Sky-Blue Overlay */}
      <HeroSection />

      {/* 2. Second Slide: Clinical Standards & Pillars */}
      <TrustBar />

      {/* 3. Third Slide: Balanced Editorial Clinic Care Presentation */}
      <HomeCareOverview />

      {/* 4. Patient Care & Sterilization Standards */}
      <PatientCareSection />

      {/* 5. Urgent Care & Direct Phone Banner */}
      <EmergencyCallout />
    </>
  );
};
