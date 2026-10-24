import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Standard utility function for conditionally merging Tailwind CSS classes
 * Used by Shadcn UI, Magic UI, and Aceternity UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
