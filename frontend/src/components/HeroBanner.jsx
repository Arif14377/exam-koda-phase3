import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdContentCopy, MdCheckCircle } from "react-icons/md";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked");
  };

  const validateUrl = () => {
    setError("");

    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return false;
    }

    // Simple URL validation
    try {
      new URL(urlInput);
    } catch {
      setError("Please enter a valid URL");
      return false;
    }

    return true;
  };

  const handleShortenUrl = async () => {
    if (!validateUrl()) {
      return;
    }

    setLoading(true);
    setShortLink("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8888/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          original_url: urlInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to shorten URL");
        setLoading(false);
        return;
      }

      // Generate short link
      const baseUrl = "http://localhost:8888";
      const slug = data.results?.slug || data.slug;
      setShortLink(`${baseUrl}/${slug}`);
      setUrlInput("");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Shorten URL error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
        <div className="max-w-2xl mx-auto">
          {/* Input & Button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="https://very-long-architectural-url.com/asset-id-0923&xf"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShortenUrl()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleShortenUrl}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors whitespace-nowrap"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Success Result */}
          {shortLink && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MdCheckCircle size={20} className="text-green-600" />
                <p className="text-green-700 font-medium">URL shortened successfully!</p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-green-300 rounded-lg p-3">
                <input
                  type="text"
                  value={shortLink}
                  readOnly
                  className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  <MdContentCopy size={16} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;