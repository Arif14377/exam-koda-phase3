const Footer = ({ showFull = false }) => {
  return (
    <footer className="flex justify-between items-center flex-wrap gap-2 px-10 py-5">
      <p className="text-xs text-gray-400 tracking-wide uppercase">
        © 2024 SHORTLINK. THE DIGITAL ARCHITECT.
      </p>
      <nav className="flex gap-6 flex-wrap">
        {showFull && (
          <>
            <a href="#" className="text-xs text-gray-400 tracking-wide uppercase hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 tracking-wide uppercase hover:text-gray-600">Terms of Service</a>
          </>
        )}
        <a href="#" className="text-xs text-gray-400 tracking-wide uppercase hover:text-gray-600">API Documentation</a>
        <a href="#" className="text-xs text-gray-400 tracking-wide uppercase hover:text-gray-600">Support</a>
      </nav>
    </footer>
  );
};

export default Footer;