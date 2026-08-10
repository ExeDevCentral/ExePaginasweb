# TODO: Optimización de rendimiento en transiciones TIENDA

- [x] B. Convertir enlace "TIENDA" de `Header.tsx` (desktop + móvil) a navegación SPA con `navigate('/tienda')` (quitar `target="_blank"`).
- [x] C. Usar `navigate` en `StorePage.tsx` para el botón "Portal de Clientes" (quitar `window.location.href`). + manejo de hash en `main.tsx` (`ScrollToTop`).
- [x] A. Elevar `PremiumBackground` a instancia única global en `main.tsx` y eliminarlo de `App.tsx`, `StorePage.tsx`, `QuoteBuilder.tsx`.
- [ ] Build/typecheck después de A (verificar imports circulares y orden de mount).
- [x] D. Reemplazar typewriter inline de `StorePage.tsx` por hook `useTypewriter`.
- [x] E. Reducir transición doble de opacidad en `App.tsx` (`motion.main` + `AnimatedPage`).
