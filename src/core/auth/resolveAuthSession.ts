/**
 * Con PKCE (flowType: 'pkce'), Supabase intercambia el ?code= automáticamente
 * y lo elimina de la URL internamente. No necesitamos limpiar nada desde el cliente.
 * Esta función se mantiene por compatibilidad con imports existentes.
 */
export async function resolveAuthSession(): Promise<void> {
  // No-op: el SDK maneja la limpieza de la URL con PKCE.
}
