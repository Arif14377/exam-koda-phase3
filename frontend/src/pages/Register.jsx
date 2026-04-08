import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // Reset error
    setError("");

    // Validasi email
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    // Validasi password dan confirm password sama
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8888/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Berhasil register, navigate ke login
      navigate("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-5">

        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center">
            <AiOutlineLink size={22} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500">Join the elite architects of the web.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
          <div className="flex flex-col gap-4">

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <InputField
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              hint="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By signing up, you agree to our{" "}
              <a href="#" className="text-blue-600">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-600">Privacy Policy</a>.
            </p>

          </div>
        </div>

        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">Log in</a>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Register;