import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Links", href: "/links" },
];

const TopNavBar = ({ activePage = "Dashboard", isLoggedIn = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <span className="text-lg font-extrabold text-gray-900">ShortLink</span>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.label;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium border-b-2 ${
                    isActive
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!isLoggedIn && (
            <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </a>
          )}
          <a
            href="/logout"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Logout
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-2 border-t border-gray-100">
          {navLinks.map((link) => {
            const isActive = activePage === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`py-2 text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="flex gap-2 pt-2">
            {!isLoggedIn && (
              <a href="/login" className="flex-1 text-center py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg">
                Login
              </a>
            )}
            <a href="/logout" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;