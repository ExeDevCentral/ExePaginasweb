import type { CSSProperties } from 'react'

export interface OgCardProps {
  eyebrow?: string | undefined
  title: string
  description?: string | undefined
  tags?: string[] | undefined
  status?: 'live' | 'demo' | 'building' | undefined
  statusLabel?: string | undefined
}

const clamp = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text

export function OgCard({
  eyebrow,
  title,
  description,
  tags = [],
  status,
  statusLabel,
}: OgCardProps) {
  const titleSize = title.length > 44 ? 52 : 62
  const safeTitle = clamp(title, 66)

  return (
    <div style={rootStyle}>
      <div
        style={{
          ...orbStyle,
          top: -140,
          left: -120,
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(14,165,233,0.32) 0%, rgba(14,165,233,0) 70%)',
        }}
      />
      <div
        style={{
          ...orbStyle,
          bottom: -180,
          right: -140,
          width: 480,
          height: 480,
          background:
            'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(217,70,239,0.06) 60%, rgba(217,70,239,0) 72%)',
        }}
      />
      <div
        style={{
          ...orbStyle,
          top: 150,
          right: 320,
          width: 180,
          height: 180,
          background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0) 70%)',
        }}
      />

      {/* Header */}
      <div style={headerStyle}>
        <div style={brandRow}>
          <div style={logoBox}>
            <span style={{ fontWeight: 800, fontSize: 26, color: '#ffffff', letterSpacing: -1 }}>
              E
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                color: '#f8fafc',
                fontWeight: 600,
              }}
            >
              ExeSistemasWEB
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3.5,
                color: '#7e8cff',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Desarrollo Web & Sistemas SaaS
            </div>
          </div>
        </div>
        <div style={sitePill}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22d38f' }} />
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: 2.5,
              fontSize: 13,
              color: '#9fb3c8',
            }}
          >
            Rosario · Argentina
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 8,
        }}
      >
        {eyebrow ? (
          <div style={eyebrowStyle}>
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: 3,
                fontSize: 15,
                fontWeight: 600,
                color: '#7dd3fc',
              }}
            >
              {clamp(eyebrow, 40)}
            </span>
          </div>
        ) : null}
        <div
          style={{
            marginTop: eyebrow ? 22 : 0,
            fontSize: titleSize,
            lineHeight: 1.06,
            fontWeight: 700,
            letterSpacing: -1.5,
            color: '#f8fafc',
            maxWidth: 1030,
          }}
        >
          {safeTitle}
        </div>
        {description ? (
          <div
            style={{
              marginTop: 18,
              fontSize: 21,
              lineHeight: 1.5,
              color: '#a9b7cc',
              maxWidth: 930,
            }}
          >
            {clamp(description, 215)}
          </div>
        ) : null}
        {tags.length > 0 ? (
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {tags.slice(0, 5).map((tag) => (
              <div key={tag} style={tagChipStyle}>
                {clamp(tag, 22)}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 1,
              color: '#7e8cff',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Código propio
          </span>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: '#3b4660' }} />
          <span style={{ fontSize: 14, letterSpacing: 1, color: '#a9b7cc' }}>
            exepaginasweb.com
          </span>
          {status ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: '#22d38f',
                  boxShadow: '0 0 12px rgba(34,211,143,0.7)',
                }}
              />
              <span style={{ fontSize: 12, letterSpacing: 2, color: '#22d38f', fontWeight: 700 }}>
                {statusLabel ?? 'EN PRODUCCIÓN'}
              </span>
            </div>
          ) : null}
        </div>
        <span
          style={{ fontSize: 12, letterSpacing: 3, color: '#5b6b84', textTransform: 'uppercase' }}
        >
          Turnos · E-Commerce · Web · SaaS
        </span>
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 1200,
  height: 630,
  padding: '56px 64px 40px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #080c1a 0%, #0d1124 45%, #141034 100%)',
  fontFamily: 'Geist, sans-serif',
}

const orbStyle: CSSProperties = {
  position: 'absolute',
  borderRadius: 999,
  pointerEvents: 'none',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const brandRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 18,
}

const logoBox: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #a855f7 100%)',
  boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
}

const sitePill: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 20px',
  borderRadius: 999,
  border: '1px solid rgba(120, 150, 220, 0.22)',
  background: 'rgba(255,255,255,0.04)',
}

const eyebrowStyle: CSSProperties = {
  display: 'flex',
  alignSelf: 'flex-start',
  padding: '10px 18px',
  borderRadius: 999,
  border: '1px solid rgba(14,165,233,0.35)',
  background: 'rgba(14,165,233,0.1)',
}

const tagChipStyle: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  fontSize: 15,
  color: '#d5deeb',
}

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 22,
  borderTop: '1px solid rgba(255,255,255,0.08)',
}
