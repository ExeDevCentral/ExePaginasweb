-- 006_rpc_subscription.sql: Función RPC para actualizar suscripciones de forma atómica

-- Esta función cancela de manera segura cualquier suscripción activa anterior e inserta la nueva
-- en una sola transacción protegida, garantizando la integridad referencial y de estado.
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
  -- 1. Determinar el intervalo de meses: prioridad al parámetro, fallback al catálogo de planes
  IF p_interval_months IS NOT NULL THEN
    v_months := p_interval_months;
  ELSE
    SELECT intervalo_meses INTO v_months FROM public.planes WHERE slug = p_plan_slug;
    v_months := COALESCE(v_months, 1); -- Fallback por defecto a 1 mes si no se encuentra
  END IF;

  -- 2. Desactivar cualquier suscripción previa que no esté ya cancelada o vencida
  UPDATE public.suscripciones
  SET estado = 'cancelada',
      cancelada_en = now(),
      updated_at = now()
  WHERE cliente_id = p_cliente_id
    AND estado NOT IN ('cancelada', 'vencida');

  -- 3. Calcular la fecha de vencimiento basándose en los meses correspondientes
  v_fecha_fin := now() + (v_months || ' month')::interval;

  -- 4. Insertar la nueva suscripción activa
  INSERT INTO public.suscripciones (
    cliente_id,
    plan_slug,
    estado,
    fecha_inicio,
    fecha_fin,
    created_at,
    updated_at
  ) VALUES (
    p_cliente_id,
    p_plan_slug,
    'activa',
    now(),
    v_fecha_fin,
    now(),
    now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;