import { MdCheckCircle } from "react-icons/md";

const VisualAnchor = () => {
  const insights = [
    "Geographic Distribution Maps",
    "Device & Browser Breakdown",
    "UTM Parameter Tracking",
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image Placeholder */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src="https://placehold.co/600x400"
              alt="Dashboard with analytics"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

          {/* Right: Content */}
          <div>
            {/* Label */}
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
              Data Driven Insights
            </p>

            {/* Heading */}
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Observe your link architecture in real-time.
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Every click is a data point. Our dashboard provides surgical precision into
              where your traffic originates, who is engaging, and how your team
              communications are performing across the globe.
            </p>

            {/* Insights List */}
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <MdCheckCircle size={24} className="text-blue-600 shrink-0" />
                  <span className="text-gray-800 font-medium">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualAnchor;