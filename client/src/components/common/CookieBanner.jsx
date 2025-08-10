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

  const acceptCookies = async () => {
    // No additional data collection, just accept the cookies and store the consent
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    await storeConsent(true); // Send to backend with consent status
    setVisible(false);
  };

  const declineCookies = async () => {
    Cookies.set('cookieConsent', 'false', { expires: 365 });
    await storeConsent(false); // Send to backend with consent status
    setVisible(false);
  };

  const storeConsent = async (consent) => {
    const visitorId = Cookies.get('visitorId') || uuidv4();
    Cookies.set('visitorId', visitorId, { expires: 365 });

    try {
      await fetch('http://localhost:5000/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          consent,
          bannerVersion: 'v1',
        }),
      });
    } catch (e) {
      console.error('Failed to log consent:', e);
    }
  };

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 text-white bg-gray-800">
      <div className="container flex flex-col items-center justify-between mx-auto md:flex-row">
        <p className="text-sm">
          We use cookies to improve your experience. By using our site, you agree to our Cookie Policy.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Accept
          </button>
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
