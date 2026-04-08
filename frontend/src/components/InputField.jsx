import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const InputField = ({ label, type = "text", placeholder, hint, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative flex items-center">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 flex items-center text-gray-400"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={18} />
            ) : (
              <AiOutlineEye size={18} />
            )}
          </button>
        )}
      </div>
      {hint && (
        <p className="text-xs text-gray-400 uppercase tracking-wide">{hint}</p>
      )}
    </div>
  );
};

export default InputField;