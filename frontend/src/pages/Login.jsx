import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import InputField from "../components/InputField";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8888";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // Validasi password tidak boleh kosong
    if (!password) {
      setError("Please enter your password");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      login(data.results.token, {
        id: data.results.user.id,
        email: data.results.user.email,
      });

      // Berhasil login, navigate ke landing page
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-5">

        <h1 className="text-2xl font-extrabold text-gray-900">ShortLink</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
          </div>

          {/* Form */}
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

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="#" className="text-sm text-blue-600">Forgot password?</Link>
              </div>
              <InputField
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Or continue with</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>

          </div>
        </div>

        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">Sign up</Link>
        </p>
      </div>

      <Footer showFull />
    </div>
  );
};

export default Login;
