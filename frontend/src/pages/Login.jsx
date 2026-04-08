import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login:", { email, password });
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
                <a href="#" className="text-sm text-blue-600">Forgot password?</a>
              </div>
              <InputField
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button onClick={handleLogin}>Log In</Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Or continue with</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>

          </div>
        </div>

        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-medium">Sign up</a>
        </p>
      </div>

      <Footer showFull />
    </div>
  );
};

export default Login;