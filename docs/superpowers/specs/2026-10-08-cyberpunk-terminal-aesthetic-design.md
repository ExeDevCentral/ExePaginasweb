# Especificación de Diseño: Cyber-Terminal HUD & Dark Cyber-Engineering Futurista

**Fecha:** 2026-10-08  
**Autor:** Exequiel Echevarria  
**Proyecto:** ExePaginasWeb  
**Estado:** Aprobado por el usuario ("SI A TODO NO PREGUNTES MAS")  

---

## 1. Visión & Propósito

Transformar la presencia estética de ExePaginasWeb de una apariencia SaaS convencional a una **consola táctica de ingeniería y centro de comando cibernético (Cyber-Terminal HUD)**. 

El objetivo es erradicar cualquier sensación de plantilla genérica y proyectar la máxima autoridad técnica, demostrando maestría en código propio, arquitectura de software de misión crítica y acabados visuales de ultra-lujo a 120 FPS.

---

## 2. Pilares de la Identidad Visual

1. **Modo Obsidiana Profundo & Neón Calibrado**:
   - Fondo de obsidiana espacial (`#03050a` / `#050811`).
   - Neón esmeralda técnico (`#10b981`), cian fotónico (`#06b6d4`) y acentos púrpuras de sobrecarga (`#a855f7`).
   - Evitar saturación visual: resplandores focalizados en puntos de interacción activa (hover overdrive, micro-diodos LED).

2. **Chasis de Hardware & Biselado Táctico**:
   - Tarjetas con cortes angulares militares/aeroespaciales (`chamfered corners` en CSS / SVG).
   - Cabeceras monospacio con telemetría en vivo: `[CORE: 01 // LOAD: OPTIMAL // PING: 4ms]`.
   - Micro-diodos LED pulsantes y tornillos/anclajes tácticos en esquinas.

3. **Micro-interacciones y Pistas de Circuito**:
   - Haces de luz láser en bordes reactivos al cursor.
   - Pistas de circuitos integrados impresos (PCB) de baja opacidad que cobran vida con el hover.
   - Sonidos y feedbacks hápticos visuales sutiles.

4. **Perspectiva y Atmósfera Tridimensional**:
   - Retícula de suelo con horizonte en perspectiva (cyber-grid) acelerada por GPU.
   - Partículas fotónicas ligeras renderizadas en canvas sin impacto en el hilo principal de la CPU.

---

## 3. Desglose de Componentes a Transformar

### A. Tarjetas de Servicios y Capacidades (`CyberTerminalCard`)
- Reemplazo y evolución de `SpotlightBorderCard` en `OptimusScaleHero.tsx` y `HowWeWorkSection.tsx`.
- Chasis biselado, telemetría de consola, LED de pulso cuántico, haz de borde láser y pistas de circuito PCB reactivas.

### B. Módulos de Precios y Comparativa (`CyberPricingModule`)
- En `Pricing.tsx` y `OwnershipVsSubscription.tsx`:
  - Contenedores estilizados como racks de servidores / procesadores de silicio.
  - Conmutador táctico de moneda/ciclo con sonido/feedback visual.
  - Gráficos y comparativas con estilo de monitores de telemetría y chips de silicio vectoriales.

### C. Barra de Navegación Táctica (`LiquidIslandNavbar` + `TelemetryHUD`)
- Indicador perimetral de actividad de red / radar sutil.
- Píldora Dynamic Island con micro-indicadores monospacio de latencia y estado de despliegue.

### D. Fondo y Retícula de Perspectiva (`CyberGridBackground`)
- Evolución de `PremiumBackground.tsx` con rejilla de perspectiva cibernética y partículas fotónicas.

---

## 4. Requisitos Globales & Restricciones

- **Cero regresiones de scroll**: Mantener la suavidad y el botón central de la rueda desbloqueado (Lenis).
- **Rendimiento**: Mantener 60/120 FPS sin tareas largas en compositor.
- **TDD & Tipado**: 100% de tests pasando en Vitest y cero errores de TypeScript (`tsc --noEmit`).
- **Copyright & Autoría**: Exequiel Echevarria, año de origen oficial 2025.
