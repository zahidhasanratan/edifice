// components/CookieBanner.jsx
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          We use cookies to improve your experience. By using our site, you agree to our Cookie Policy.
        </p>
        <button
          onClick={acceptCookies}
          className="mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
