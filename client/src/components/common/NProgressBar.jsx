'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/styles/nprogress-custom.css'; // custom styles if you want

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120,
  minimum: 0.1,
});

const NProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default NProgressBar;
