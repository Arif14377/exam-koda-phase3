import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Links", href: "/links" },
];

const TopNavBar = ({ activePage = "Dashboard" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleNavClick = (href) => {
    setMenuOpen(false);
    
    // Cek apakah route memerlukan auth
    if ((href === "/dashboard" || href === "/links" || href === "/analytics") && !isLoggedIn) {
      navigate('/login');
      return;
    }
    
    navigate(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          {!isLoggedIn ? (
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Logout
            </button>
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
            {!isLoggedIn ? (
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
              <button 
                onClick={handleLogout} 
                className="w-full py-2 text-sm font-semibold text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;