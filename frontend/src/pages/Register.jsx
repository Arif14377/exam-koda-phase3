import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    console.log("Register:", { email, password, confirmPassword });
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

            <Button onClick={handleRegister}>Sign Up</Button>

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