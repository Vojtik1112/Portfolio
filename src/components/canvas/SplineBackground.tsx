"use client";

import { useEffect, useState } from "react";

export default function SplineBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // 1. Defer loading to allow main thread to settle (LCP)
    // 2. Check if device is mobile - if so, skip loading the heavy 3D scene
    const timeout = setTimeout(() => {
      if (window.innerWidth >= 768) {
        setShouldLoad(true);
      }
    }, 1000); // 1s delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      {/* High-quality static gradient fallback for mobile & loading state */}

      {shouldLoad && (
        <iframe
          src="https://my.spline.design/3dgradient-AcpgG6LxFkpnJSoowRHPfcbO"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          className="absolute inset-0 border-none w-full h-full animate-in fade-in duration-1000 z-10"
          title="Spline 3D Background"
          loading="lazy"
        />
      )}
    </div>
  );
}
