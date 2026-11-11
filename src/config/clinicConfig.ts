import doctorPhoto from '../assets/dr_usama.jpg';
import clinicLogo from '../assets/logo.png';

export interface ClinicConfig {
  name: string;
  shortName: string;
  tagline: string;
  doctorName: string;
  qualification: string;
  specialization: string;
  experienceYears: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappRaw: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  mapsDirectUrl: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  googleMapsEmbedUrl: string;
  apiBaseUrl: string;
  logoImage: string;
  doctorImage: string;
  heroVideoUrl: string;
  heroPosterUrl: string;
  heroImage: string;
  clinicImage: string;
  equipmentImage: string;
}

export const clinicConfig: ClinicConfig = {
  name: "Mansehra Dental Lounge",
  shortName: "Dental Lounge",
  tagline: "Excellence in Dental Care & Aesthetics in Mansehra",
  doctorName: "Usama Ismail Abbasi",
  qualification: "BDS (Ayub Medical College) RDS",
  specialization: "Dental Surgeon & Restorative Specialist",
  experienceYears: "Registered Dental Surgeon",
  phone: "0348 2226228",
  phoneRaw: "+923482226228",
  whatsapp: "0348 2226228",
  whatsappRaw: "+923482226228",
  email: "dentalloungemansehra@gmail.com",
  address: "Biotech Medical Center, Opposite King Abdullah Teaching Hospital",
  landmark: "Opposite King Abdullah Teaching Hospital",
  city: "Mansehra",
  province: "Khyber Pakhtunkhwa",
  country: "Pakistan",
  postalCode: "21300",
  mapsDirectUrl: "https://maps.app.goo.gl/XyaJotKZBxjn2Jyd7?g_st=aw",
  openingHours: {
    weekdays: "Monday – Saturday: 3:00 PM – 9:00 PM",
    saturday: "Monday – Saturday: 3:00 PM – 9:00 PM",
    sunday: "Sunday: Closed (Emergency on Call)",
  },
  googleMapsEmbedUrl:
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13165.651582236746!2d73.197775!3d34.33125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de459999999999%3A0x69074092b7721868!2sKing%20Abdullah%20Teaching%20Hospital%2C%20Mansehra%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  
  logoImage: clinicLogo,
  doctorImage: doctorPhoto,
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-41804-large.mp4",
  heroPosterUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=85",
  heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=85",
  clinicImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  equipmentImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
};
