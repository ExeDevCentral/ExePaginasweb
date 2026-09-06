# CraftedBySignature

Componente reutilizable del badge de firma **"Crafted with precision by Exepaginasweb.com"**.

## Uso básico

```tsx
import CraftedBySignature from './components/shared/CraftedBySignature'

// En el footer, sobre fondo oscuro
<CraftedBySignature variant="dark" showBar />

// Inline, sobre fondo claro
<CraftedBySignature variant="light" className="mt-8" />
```

## Props

| Prop      | Tipo                | Default | Descripción                                                      |
| :-------- | :------------------ | :------ | :--------------------------------------------------------------- |
| `variant` | `'light' \| 'dark'` | `'dark'`| Adapta contraste y acento al fondo del sitio anfitrión.          |
| `className`| `string`           | `''`    | Clases extra para posicionamiento/spacing.                       |
| `showBar` | `boolean`           | `false` | Si es `true`, renderiza la barra completa con línea superior.    |

## Animaciones

- **Shimmer**: barrido de luz sobre el badge al hacer hover (`animate-signature-shimmer`).
- **Glow**: halo sutil de color ámbar que pulsa continuamente (`animate-signature-glow`).
- **Sparkle**: el icono de estrella rota 180° y crece al hover.

## Tokens que necesita el sitio anfitrión

El componente no depende de variables de tema específicas. Usa únicamente colores de Tailwind:

- Fondos: `bg-white/[0.03]` (dark) / `bg-slate-900/[0.03]` (light)
- Acento: ámbar (`amber-400/500/600`) y rosa (`rose-700`) para el gradiente de la marca.

No requiere fuentes custom ni CSS extra. Si el sitio anfitrión usa Tailwind, copiá el archivo `CraftedBySignature.tsx` y las animaciones de `tailwind.config.js`:

```js
animation: {
  'signature-shimmer': 'signatureShimmer 2.5s ease-in-out infinite',
  'signature-glow': 'signatureGlow 3s ease-in-out infinite',
},
keyframes: {
  signatureShimmer: {
    '0%, 100%': { backgroundPosition: '-200% 0' },
    '50%': { backgroundPosition: '200% 0' },
  },
  signatureGlow: {
    '0%, 100%': { opacity: '0.4' },
    '50%': { opacity: '0.8' },
  },
}
```

## Opciones de distribución

### A) Copy-paste (rápido)
Copiá `CraftedBySignature.tsx` + las dos animaciones de `tailwind.config.js` a cada repo.

### B) Paquete privado `@exepaginasweb/ui-signature`
Para compartirlo entre todos los sitios del portafolio, publicarlo como paquete npm privado o workspace:

```bash
npm install @exepaginasweb/ui-signature
```

```tsx
import { CraftedBySignature } from '@exepaginasweb/ui-signature'
```

Cualquier mejora en la animación se hereda en el próximo `npm update`.
