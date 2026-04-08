import { AiOutlineArrowRight } from "react-icons/ai";

const Button = ({ children, onClick, type = "button", variant = "primary" }) => {
  const baseClass = "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer border";

  const variantClass =
    variant === "secondary"
      ? "bg-white text-gray-700 border-gray-300"
      : "bg-blue-600 text-white border-blue-600";

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${variantClass}`}>
      {children}
      <AiOutlineArrowRight size={16} />
    </button>
  );
};

export default Button;