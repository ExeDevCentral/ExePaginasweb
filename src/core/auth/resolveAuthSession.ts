export async function resolveAuthSession(): Promise<void> {
  const { hash } = window.location
  if (!hash || !hash.includes('access_token')) return

  const cleanPath = window.location.pathname
  window.history.replaceState(window.history.state, '', cleanPath)
}
