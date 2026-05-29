import { useEffect, useRef } from 'react'

const AD_CLIENT = 'ca-pub-9450015187260945'

declare global {
  interface Window {
    adsbygoogle?: { push: (args: unknown) => void }
  }
}

type Props = {
  slotId: string
}

export default function AdSlot({ slotId }: Props) {
  const slotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!slotRef.current) return
    if (!window.adsbygoogle?.push) return

    try {
      window.adsbygoogle.push({})
    } catch {
      // Falló la inicialización del slot
    }
  }, [])

  return (
    <div ref={slotRef} className="flex justify-center my-10">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
      />
    </div>
  )
}
