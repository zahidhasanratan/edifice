const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-10 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-gray-800 dark:border-gray-200 pt-2">
        {/* Logo & Slogan */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/assets/images/logo/logo.png" alt="Logo" className="w-32 mb-2" />
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-white">
            <li><a href="/" className="hover:text-[#c20e35] transition">Home</a></li>
            <li><a href="/about" className="hover:text-[#c20e35] transition">About</a></li>
            <li><a href="/projects" className="hover:text-[#c20e35] transition">Projects</a></li>
            <li><a href="/contact" className="hover:text-[#c20e35] transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-white">
            <li><strong>T :</strong> 01614098055</li>
            <li><strong>H :</strong> 02-9133366</li>
            <li>
              <strong>E :</strong>
              <a href="mailto:info@ddmbd.org" className="hover:text-[#c20e35]"> info@ddmbd.org</a>
            </li>
          </ul>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
            Address
          </h3>
          <p className="text-sm text-gray-600 dark:text-white leading-relaxed">
            46, Kazi Nazrul Islam Avenue (3rd Floor)<br />
            Besides Hotel Super Star, Kawran Bazar,<br />
            Dhaka-1215,<br />
            Bangladesh
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 dark:border-gray-300 pt-6 text-center text-xs dark:text-gray-400 text-gray-600">
        <p>&copy; 2025 EDIFICE. ALL RIGHTS ARE RESERVED</p>
        <p className="mt-1">
          <a href="https://www.esoft.com.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-[#c20e35]">
            Web Design Company : <span className="font-cursive">e-<span className="text-red-500">S</span>oft</span>
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
