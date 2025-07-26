const Footer = () => {
  return (
    <footer className="bg-base-100 border-t border-base-300 text-center text-sm py-4 mt-auto text-gray-500">
      <p>
  © {new Date().getFullYear()} All rights reserved. This software is developed by <span className="font-semibold">e-Soft</span>.
</p>
    </footer>
  );
};

export default Footer;
