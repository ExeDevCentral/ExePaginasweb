import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-9450015187260945';
const AD_SLOT = 'pub-9450015187260945';

declare global {
  interface Window {
    adsbygoogle?: { push: (args: unknown) => void };
  }
}

export default function AdSlot() {
  const slotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slotRef.current) return;
    if (!window.adsbygoogle?.push) return;

    try {
      window.adsbygoogle.push({});
    } catch {
      // Evita romper la app si el slot aún no está listo / falló la inicialización.
    }
  }, []);

  return (
    <div ref={slotRef} className="flex justify-center my-10">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
      />
    </div>
  );
}

