const FeatureCard = ({ icon: Icon, title, description, accentColor, barColor }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${accentColor}`}
      >
        <Icon size={28} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Accent Bar */}
      <div
        className={`h-1 w-12 rounded-full ${barColor || accentColor}`}
      ></div>
    </div>
  );
};

export default FeatureCard;