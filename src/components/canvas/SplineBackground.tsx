"use client";

import { useEffect, useState } from "react";

export default function SplineBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer loading to allow main thread to settle (LCP)
    const timeout = setTimeout(() => {
      setShouldLoad(true);
    }, 1500); // 1.5s delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black transition-opacity duration-1000">
      {shouldLoad && (
        <iframe
          src="https://my.spline.design/3dgradient-AcpgG6LxFkpnJSoowRHPfcbO"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          className="border-none w-full h-full animate-in fade-in duration-1000"
          title="Spline 3D Background"
          loading="lazy"
        />
      )}
    </div>
  );
}
