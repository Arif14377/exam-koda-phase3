import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLearnMore = () => {
    // Link ke halaman Learn More atau section tertentu
    console.log("Learn More clicked");
  };

  return (
    <section className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center">
      <div className="container mx-auto px-4 py-20">
        {/* Text Section */}
        <div className="text-center mb-12">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Shorten URLs.{" "}
            <span className="text-blue-600">Share Easily.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Create short, memorable links for your team communications.
            Transform long, cumbersome URLs into powerful digital assets that
            drive engagement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={handleLearnMore}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* URL Shortener Section */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="https://very-long-architectural-url.com/asset-id-0923&xf"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Shorten
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;