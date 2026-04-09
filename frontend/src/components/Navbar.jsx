import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Links", href: "/links" },
];

const TopNavBar = ({ activePage = "Dashboard" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, profile } = useAuth();
  const userImage = profile?.user_image || localStorage.getItem('user_image') || '';

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${API_URL}${path}`;
  };

  const handleNavClick = (href) => {
    setMenuOpen(false);
    
    // Cek apakah route memerlukan auth
    if ((href === "/dashboard" || href === "/links" || href === "/analytics") && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(href);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="text-lg font-extrabold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
        >
          ShortLink
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.label;
            return (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 ${
                    isActive
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden bg-gray-100"
                aria-label="Go to profile"
              >
                <img
                  src={resolveImageUrl(userImage) || "https://placehold.co/80x80"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
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
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`py-2 text-sm font-medium text-left cursor-pointer ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="flex gap-2 pt-2">
          {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => { setMenuOpen(false); navigate('/login'); }}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setMenuOpen(false); navigate('/register'); }}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  className="flex-1 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
