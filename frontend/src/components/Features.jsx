import { BsLightningCharge } from "react-icons/bs";
import { MdEditNote } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import FeatureCard from "./FeaturesCard";

const Features = () => {
  const features = [
    {
      icon: BsLightningCharge,
      title: "Easy Create",
      description:
        "Instantly generate high-performance short links with a single click or through our surgical API endpoints.",
      accentColor: "bg-blue-200",
      barColor: "bg-blue-400",
    },
    {
      icon: MdEditNote,
      title: "Custom Slugs",
      description:
        "Maintain brand authority with readable, custom link endings that resonate with your digital audience.",
      accentColor: "bg-blue-200",
      barColor: "bg-blue-400",
    },
    {
      icon: RiTeamLine,
      title: "Team Ready",
      description:
        "Collaborate across departments with shared workspaces, permissions, and unified analytics dashboards.",
      accentColor: "bg-orange-200",
      barColor: "bg-orange-400",
    },
  ];

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        {/* Label */}
        <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
          Architectural Features
        </p>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Built for Enterprise Precision
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
              barColor={feature.barColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
