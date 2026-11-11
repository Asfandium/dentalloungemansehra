import fillingImg from '../assets/services/filling.jpg';
import dentureImg from '../assets/services/denture.jpg';
import bridgeImg from '../assets/services/bridge.jpg';
import implantImg from '../assets/services/implant.jpg';
import bracesImg from '../assets/services/braces.jpg';

export interface DentalService {
  id: string;
  orderNumber: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  whoItIsFor: string;
  generalBenefits: string[];
  iconName: string;
  image: string;
  category: 'Preventative' | 'Restorative' | 'Cosmetics' | 'Orthodontics';
  priceDisplay: string;
  priceNote?: string;
}

export const EXACT_SERVICE_NAMES = [
  "General Routine Check-up",
  "Extraction",
  "Filling",
  "Root Canal Treatment - RCT",
  "Scaling & Polishing",
  "Teeth Whitening",
  "Denture",
  "Bridges",
  "Implants",
  "Braces & Aligners",
] as const;

export type ServiceName = typeof EXACT_SERVICE_NAMES[number];

export const fallbackServicesData: DentalService[] = [
  {
    id: "general-checkup",
    orderNumber: 1,
    name: "General Routine Check-up",
    shortDescription: "Comprehensive oral examination, digital evaluation, and preventive oral health assessment.",
    fullDescription: "Regular routine check-ups allow early detection of cavities, gum disease, and structural dental issues before they turn into complex conditions. Includes detailed consultation and tailored advice.",
    whoItIsFor: "Recommended for patients of all ages every 6 months to maintain optimal oral health.",
    generalBenefits: [
      "Early identification of decay and gum problems",
      "Comprehensive digital evaluation",
      "Personalized preventive oral hygiene guidance"
    ],
    iconName: "Stethoscope",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
    category: "Preventative",
    priceDisplay: "PKR 1,000 – 1,500",
    priceNote: "Includes complete oral exam & treatment planning"
  },
  {
    id: "extraction",
    orderNumber: 2,
    name: "Extraction",
    shortDescription: "Gentle removal of severely damaged, non-restorable, or troublesome wisdom teeth.",
    fullDescription: "Painless extraction procedures performed under local anesthesia with minimal discomfort. Focus on preserving surrounding bone structure and smooth post-treatment healing.",
    whoItIsFor: "Patients with non-restorable decay, severe structural damage, or troublesome impacted wisdom teeth.",
    generalBenefits: [
      "Relief from localized pain and infection",
      "Minimally invasive technique preserving surrounding tissue",
      "Clear post-care guidance for rapid recovery"
    ],
    iconName: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
    category: "Restorative",
    priceDisplay: "PKR 2,500 – 6,000",
    priceNote: "Varies by tooth complexity & surgical requirement"
  },
  {
    id: "filling",
    orderNumber: 3,
    name: "Filling",
    shortDescription: "Tooth-colored composite resin fillings to repair cavities and restore natural tooth structure.",
    fullDescription: "High-grade aesthetic composite resin fillings that blend seamlessly with natural enamel color, restoring structural strength and stopping further decay progression.",
    whoItIsFor: "Individuals with minor to moderate cavities, chipped teeth, or worn enamel surfaces.",
    generalBenefits: [
      "Natural shade matching to existing enamel",
      "Restores biting function and tooth strength",
      "Durable aesthetic restorative material"
    ],
    iconName: "ShieldCheck",
    image: fillingImg,
    category: "Restorative",
    priceDisplay: "PKR 3,000 – 6,500",
    priceNote: "Per tooth surface restored"
  },
  {
    id: "root-canal",
    orderNumber: 4,
    name: "Root Canal Treatment - RCT",
    shortDescription: "Precision nerve treatment to save infected teeth and alleviate severe toothaches.",
    fullDescription: "Root canal therapy cleans and disinfects the infected internal pulp chamber, sealing it against future bacteria to save your natural tooth without extraction.",
    whoItIsFor: "Patients suffering from deep tooth pain, temperature sensitivity, or internal pulp infection.",
    generalBenefits: [
      "Saves natural tooth structure",
      "Eliminates severe pain and deep infection",
      "Restores normal chewing comfort"
    ],
    iconName: "Activity",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
    category: "Restorative",
    priceDisplay: "PKR 8,000 – 16,000",
    priceNote: "Varies for anterior vs posterior molar roots"
  },
  {
    id: "scaling-polishing",
    orderNumber: 5,
    name: "Scaling & Polishing",
    shortDescription: "Professional ultrasonic calculus removal for clean teeth and healthier gums.",
    fullDescription: "Deep cleaning procedure removing stubborn plaque, tartar deposits, and external stains. Leaves teeth thoroughly smooth and protects against periodontitis.",
    whoItIsFor: "Anyone experiencing plaque buildup, bleeding gums, or wanting refreshed breath.",
    generalBenefits: [
      "Prevents gum disease and inflammation",
      "Removes stubborn surface stains",
      "Leaves teeth feeling smooth and clean"
    ],
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=85",
    category: "Preventative",
    priceDisplay: "PKR 3,500 – 6,500",
    priceNote: "Full mouth scaling & aesthetic polish"
  },
  {
    id: "teeth-whitening",
    orderNumber: 6,
    name: "Teeth Whitening",
    shortDescription: "Safe clinical enamel brightening for a radiance-boosting, youthful smile.",
    fullDescription: "Professional-grade bleaching techniques that target deep discoloration from coffee, tea, and aging. Designed for noticeable results with low sensitivity.",
    whoItIsFor: "Patients seeking a brighter, whiter smile for special occasions or personal confidence.",
    generalBenefits: [
      "Lifts stubborn enamel discolorations",
      "Safe, enamel-friendly brightening protocol",
      "Immediate visible enhancement"
    ],
    iconName: "Sun",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=85",
    category: "Cosmetics",
    priceDisplay: "PKR 15,000 – 28,000",
    priceNote: "Complete in-clinic whitening treatment"
  },
  {
    id: "denture",
    orderNumber: 7,
    name: "Denture",
    shortDescription: "Custom partial and full dentures tailored for comfortable fit and natural appearance.",
    fullDescription: "Precision-crafted removable appliances designed to replace multiple missing teeth. Restores facial contour, speech clarity, and comfortable eating abilities.",
    whoItIsFor: "Patients missing multiple teeth or entire arches needing functional tooth replacement.",
    generalBenefits: [
      "Custom fitted for stability and comfort",
      "Restores chewing ability and speech clarity",
      "Supports natural facial muscle structure"
    ],
    iconName: "Heart",
    image: dentureImg,
    category: "Restorative",
    priceDisplay: "PKR 18,000 – 40,000",
    priceNote: "Depending on partial vs complete arch denture"
  },
  {
    id: "bridges",
    orderNumber: 8,
    name: "Bridges",
    shortDescription: "Fixed prosthetic bridges to bridge gaps left by missing teeth.",
    fullDescription: "Permanent ceramic bridges attached to adjacent anchor teeth, restoring continuous alignment, preventing surrounding teeth from shifting, and completing your smile.",
    whoItIsFor: "Individuals with one or more missing consecutive teeth seeking a non-removable solution.",
    generalBenefits: [
      "Fixed, non-removable prosthetic restoration",
      "Prevents adjacent teeth from drifting",
      "Blends naturally with surrounding teeth"
    ],
    iconName: "Layers",
    image: bridgeImg,
    category: "Restorative",
    priceDisplay: "PKR 9,000 – 20,000 / unit",
    priceNote: "Depending on PFM or Zirconia crown quality"
  },
  {
    id: "implants",
    orderNumber: 9,
    name: "Implants",
    shortDescription: "Permanent biocompatible titanium implants for artificial root and crown replacement.",
    fullDescription: "Modern dental implants fuse directly with jawbone tissue to provide a permanent foundation for realistic single crowns or bridges without relying on adjacent teeth.",
    whoItIsFor: "Adults seeking the most durable, natural-feeling long-term tooth replacement option.",
    generalBenefits: [
      "Preserves jawbone density and structural health",
      "Feels, functions, and looks like natural teeth",
      "Long-lasting permanent dental solution"
    ],
    iconName: "Anchor",
    image: implantImg,
    category: "Restorative",
    priceDisplay: "PKR 65,000 – 110,000",
    priceNote: "Includes surgical fixture & abutment crown"
  },
  {
    id: "braces-aligners",
    orderNumber: 10,
    name: "Braces & Aligners",
    shortDescription: "Orthodontic options including traditional metal braces and clear removable aligners.",
    fullDescription: "Comprehensive orthodontic alignment treatments to correct misaligned teeth, bite irregularities, and crowding. Personalized treatment plans for teens and adults.",
    whoItIsFor: "Patients with crooked teeth, overcrowding, spacing gaps, or bite misalignments.",
    generalBenefits: [
      "Corrects alignment for long-term oral health",
      "Discrete clear aligner options available",
      "Improves smile aesthetics and bite function"
    ],
    iconName: "Smile",
    image: bracesImg,
    category: "Orthodontics",
    priceDisplay: "PKR 85,000 – 190,000",
    priceNote: "Flexible installment plans available"
  }
];

export const servicesData = fallbackServicesData;
