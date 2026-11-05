-- Datos base de desarrollo. El schema y las políticas se definen en migrations/.
INSERT INTO public.planes (
  slug,
  nombre,
  precio,
  caracteristicas,
  intervalo_meses,
  activo,
  moneda
)
VALUES
  (
    'mantenimiento-basico',
    'Abono Básico',
    25000,
    ARRAY['Landing', 'SSL', 'Hosting Vercel'],
    1,
    true,
    'ARS'
  ),
  (
    'mantenimiento-avanzado',
    'Abono Avanzado',
    50000,
    ARRAY['Sistemas', 'Reservas', 'BD', 'Backups'],
    1,
    true,
    'ARS'
  ),
  (
    'mantenimiento-premium',
    'Abono Premium',
    150000,
    ARRAY['Edge prioritario', '2h dev', 'Account Manager'],
    1,
    true,
    'ARS'
  )
ON CONFLICT (slug) DO NOTHING;
