namespace DentalLounge.Domain.Common;

public record CanonicalServiceDefinition(
    string StableKey,
    int DisplayOrder,
    string Name,
    string Category,
    string ShortDescription,
    string FullDescription,
    string WhoItIsFor,
    string[] GeneralBenefits,
    decimal? InitialPriceAmount,
    string InitialPriceDisplayMode,
    string? InitialPriceNote,
    string DefaultImageUrl
);

public static class CanonicalServices
{
    public static readonly IReadOnlyList<CanonicalServiceDefinition> Catalog = new List<CanonicalServiceDefinition>
    {
        new(
            StableKey: "routine-checkup",
            DisplayOrder: 1,
            Name: "General Routine Check-up",
            Category: "Preventative",
            ShortDescription: "Comprehensive clinical oral examination, dental charting, soft tissue inspection, and cavity screening.",
            FullDescription: "Comprehensive diagnostic assessment of teeth, gums, and oral mucosa. Includes digital intraoral camera screening to identify micro-fractures, early enamel decay, and periodontal conditions before they escalate into painful emergencies.",
            WhoItIsFor: "Every adult, child, and senior recommended at 6-month intervals for preventative maintenance.",
            GeneralBenefits: new[] { "Early decay detection", "Personalized hygiene consultation", "Zero invasive discomfort", "Long-term cost savings" },
            InitialPriceAmount: 1500m,
            InitialPriceDisplayMode: "Fixed",
            InitialPriceNote: "Standard diagnostic consultation",
            DefaultImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
        ),
        new(
            StableKey: "extraction",
            DisplayOrder: 2,
            Name: "Extraction",
            Category: "Restorative",
            ShortDescription: "Gentle tooth removal under local anesthesia for severely broken, infected, or impacted teeth.",
            FullDescription: "Minimally invasive tooth extraction utilizing specialized elevators and gentle luxation techniques to preserve surrounding alveolar bone. Performed under effective local anesthesia to ensure minimal discomfort.",
            WhoItIsFor: "Patients with non-restorable decayed teeth, severe periodontal bone loss, or problematic wisdom teeth.",
            GeneralBenefits: new[] { "Immediate acute pain relief", "Infection containment", "Maximized alveolar bone preservation", "Rapid post-operative healing" },
            InitialPriceAmount: 2000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Varies by tooth complexity and impaction",
            DefaultImageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80"
        ),
        new(
            StableKey: "filling",
            DisplayOrder: 3,
            Name: "Filling",
            Category: "Restorative",
            ShortDescription: "High-strength composite resin restorations color-matched seamlessly to your natural tooth enamel.",
            FullDescription: "Removal of carious tissue followed by adhesive enamel etching and multi-layered light-cured composite placement. Carefully contoured to replicate natural dental cusps and anatomical bite planes.",
            WhoItIsFor: "Patients with dental cavities, chipped incisal edges, or leaking old metal fillings.",
            GeneralBenefits: new[] { "Natural tooth-colored appearance", "Bonds directly to remaining tooth structure", "Mercury-free composite biocompatibility", "Chewing functionality restored immediately" },
            InitialPriceAmount: 2500m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Per tooth based on cavity depth & surfaces",
            DefaultImageUrl: "/assets/services/filling.jpg"
        ),
        new(
            StableKey: "rct",
            DisplayOrder: 4,
            Name: "Root Canal Treatment - RCT",
            Category: "Restorative",
            ShortDescription: "Specialized endodontic therapy to remove infected pulp tissue and save your natural tooth from extraction.",
            FullDescription: "Thorough biomechanical cleaning and shaping of infected root canal anatomy using rotary nickel-titanium instrumentation and antibacterial irrigation. Hermetically sealed with warm gutta-percha.",
            WhoItIsFor: "Individuals experiencing severe throbbing toothache, sensitivity to hot/cold liquids, or apical abscesses.",
            GeneralBenefits: new[] { "Saves natural tooth from extraction", "Eliminates chronic dental infection", "Relieves persistent throbbing pain", "Restores normal bite pressure" },
            InitialPriceAmount: 7000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Varies by anterior, premolar, or multi-canal molar",
            DefaultImageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
        ),
        new(
            StableKey: "scaling-polishing",
            DisplayOrder: 5,
            Name: "Scaling & Polishing",
            Category: "Preventative",
            ShortDescription: "Ultrasonic tartar removal and stain polishing to treat gingivitis and freshen oral hygiene.",
            FullDescription: "Thorough supragingival and subgingival plaque debridement using gentle ultrasonic instrumentation. Finished with fine-grit fluoride paste polishing to leave tooth enamel smooth and resistant to new stain buildup.",
            WhoItIsFor: "Recommended annually for everyone; essential for bleeding gums, coffee/tea stains, and bad breath.",
            GeneralBenefits: new[] { "Halts bleeding gums and gingivitis", "Eliminates persistent stains and tartar", "Refreshes breath and oral hygiene", "Strengthens periodontal bone attachment" },
            InitialPriceAmount: 3000m,
            InitialPriceDisplayMode: "Fixed",
            InitialPriceNote: "Complete full-mouth scaling and polishing",
            DefaultImageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80"
        ),
        new(
            StableKey: "teeth-whitening",
            DisplayOrder: 6,
            Name: "Teeth Whitening",
            Category: "Cosmetics",
            ShortDescription: "Professional dental bleaching to brighten discolored or yellowing enamel by multiple shades.",
            FullDescription: "In-office cosmetic bleaching applying professional carbamide or hydrogen peroxide gel under soft tissue isolation and activation. Lightens deep tea, coffee, smoking, and age-related stains safely without harming enamel.",
            WhoItIsFor: "Adults seeking a brighter smile for weddings, professional careers, or aesthetic refreshment.",
            GeneralBenefits: new[] { "Lifts multiple shades safely", "Preserves enamel integrity", "Fast, noticeable in-office results", "Boosts personal smile confidence" },
            InitialPriceAmount: 15000m,
            InitialPriceDisplayMode: "Fixed",
            InitialPriceNote: "Full-arch in-office bleaching treatment",
            DefaultImageUrl: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=1200&q=80"
        ),
        new(
            StableKey: "denture",
            DisplayOrder: 7,
            Name: "Denture",
            Category: "Restorative",
            ShortDescription: "Custom-fitted partial and complete acrylic or cast prosthetics to replace multiple missing teeth.",
            FullDescription: "Precision impression fabrication of removable prosthetic arches designed to restore facial volume, lip support, and masticatory capability. Available in flexible, acrylic, and cast-metal framework designs.",
            WhoItIsFor: "Patients missing multiple teeth in an arch or fully edentulous patients seeking affordable smile restoration.",
            GeneralBenefits: new[] { "Restores confident chewing and speech", "Provides full lip and facial structure support", "Custom-fit comfort", "Cost-effective tooth replacement" },
            InitialPriceAmount: 18000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Per arch depending on partial or complete denture",
            DefaultImageUrl: "/assets/services/denture.jpg"
        ),
        new(
            StableKey: "bridges",
            DisplayOrder: 8,
            Name: "Bridges",
            Category: "Restorative",
            ShortDescription: "Fixed permanent ceramic dental prostheses anchored securely to adjacent teeth to span tooth gaps.",
            FullDescription: "Non-removable prosthetic restoration consisting of retainer crowns cemented onto prepared abutment teeth with an artificial pontic tooth bridging the edentulous space. Made from durable porcelain fused to metal or translucent zirconia.",
            WhoItIsFor: "Patients missing one or two teeth who desire a permanent, non-removable alternative to partial dentures.",
            GeneralBenefits: new[] { "Permanent fixed non-removable solution", "Prevents adjacent teeth from drifting", "Seamless aesthetic appearance", "Full chewing function and natural feel" },
            InitialPriceAmount: 6000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Per unit based on PFM or all-ceramic zirconia",
            DefaultImageUrl: "/assets/services/bridge.jpg"
        ),
        new(
            StableKey: "implants",
            DisplayOrder: 9,
            Name: "Implants",
            Category: "Restorative",
            ShortDescription: "State-of-the-art titanium post fixtures surgically placed into jawbone to mimic natural tooth roots.",
            FullDescription: "The gold standard in permanent tooth replacement: a biocompatible titanium fixture integrates with the alveolar jawbone (osseointegration), topped with a customized custom abutment and lifelike zirconia crown.",
            WhoItIsFor: "Adults in good systemic health with adequate bone density seeking the longest-lasting tooth replacement.",
            GeneralBenefits: new[] { "Lifelong root-level tooth replacement", "Halts jawbone resorption and bone loss", "Does not compromise neighboring teeth", "Natural bite force and lifelike feel" },
            InitialPriceAmount: 65000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Per implant fixture and restorative crown",
            DefaultImageUrl: "/assets/services/implant.jpg"
        ),
        new(
            StableKey: "braces-aligners",
            DisplayOrder: 10,
            Name: "Braces & Aligners",
            Category: "Orthodontics",
            ShortDescription: "Orthodontic alignment for crooked teeth, crowding, bite malocclusions, and aesthetic smile harmony.",
            FullDescription: "Correction of dental malocclusions, spacing, and crowding through continuous, calibrated orthodontic force using metal brackets, ceramic cosmetic brackets, or sequential clear aligner trays.",
            WhoItIsFor: "Teens and adults with crowded teeth, overbites, underbites, gap teeth, or misaligned dental arches.",
            GeneralBenefits: new[] { "Corrects crowding and bite malocclusion", "Enhances long-term facial aesthetics", "Significantly easier tooth brushing", "Prevents uneven dental wear" },
            InitialPriceAmount: 80000m,
            InitialPriceDisplayMode: "StartingFrom",
            InitialPriceNote: "Complete comprehensive orthodontic course",
            DefaultImageUrl: "/assets/services/braces.jpg"
        )
    };

    public static readonly IReadOnlyList<string> Names = Catalog.Select(s => s.Name).ToList();
}
