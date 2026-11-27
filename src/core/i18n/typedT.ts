import type { TFunction } from 'i18next'

/**
 * Typed bridge for dynamic/template i18n keys.
 * Centraliza el cast inevitable cuando la key se construye en runtime.
 */
export function ti(
  t: TFunction,
  key: string,
  optionsOrDefault?: Record<string, unknown> | string
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic key bridge
  const args: any[] = [key]
  if (optionsOrDefault !== undefined) args.push(optionsOrDefault)
  const val = (t as any)(...args)
  return typeof val === 'string' ? val : String(val ?? key)
}
