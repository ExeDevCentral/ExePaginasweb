import React from 'react'

interface LogoProps {
  className?: string
  alt?: string
  size?: number
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-10 w-auto',
  alt = 'ExePaginasWeb Logo',
  size = 40,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Light theme logo (Dark text + Yellow bar) */}
      <img
        src="/logo-light.webp"
        alt={alt}
        loading="eager"
        fetchPriority="high"
        width={size}
        height={size}
        className="h-full w-auto object-contain dark:hidden filter drop-shadow-[0_0_8px_rgba(250,204,21,0.3)] transition-transform duration-300 group-hover:scale-105"
      />
      {/* Dark theme logo (White text + Yellow bar) */}
      <img
        src="/logo-dark.webp"
        alt={alt}
        loading="eager"
        fetchPriority="high"
        width={size}
        height={size}
        className="h-full w-auto object-contain hidden dark:block filter drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  )
}

export default Logo
