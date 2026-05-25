-- Función RPC para actualizar suscripciones de forma atómica
-- Se asegura de cancelar las previas e insertar la nueva en una sola transacción.

CREATE OR REPLACE FUNCTION public.handle_subscription_update(
  p_cliente_id UUID,
  p_plan_slug TEXT,
  p_interval_months INT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_months INT;
  v_fecha_fin TIMESTAMPTZ;
BEGIN
  -- 1. Determinar el intervalo: prioridad al parámetro, si no, buscar en la tabla planes
  IF p_interval_months IS NOT NULL THEN
    v_months := p_interval_months;
  ELSE
    SELECT intervalo_meses INTO v_months FROM public.planes WHERE slug = p_plan_slug;
    v_months := COALESCE(v_months, 1); -- Fallback a 1 mes si no se encuentra
  END IF;

  -- 2. Desactivar cualquier suscripción previa que no esté ya cancelada
  UPDATE public.suscripciones
  SET estado = 'cancelada'
  WHERE cliente_id = p_cliente_id
    AND estado != 'cancelada';

  -- 3. Calcular la fecha de vencimiento
  v_fecha_fin := now() + (v_months || ' month')::interval;

  -- 4. Crear la nueva suscripción activa
  INSERT INTO public.suscripciones (
    cliente_id,
    plan_slug,
    estado,
    fecha_inicio,
    fecha_fin
  ) VALUES (
    p_cliente_id,
    p_plan_slug,
    'activa',
    now(),
    v_fecha_fin
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;