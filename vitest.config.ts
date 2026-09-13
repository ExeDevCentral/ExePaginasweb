import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/lib': path.resolve(__dirname, './lib'),
      '@/src': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      reportOnFailure: false,
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/*.mock.*',
      ],
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85,
      all: true,
      skipFull: false,
      perFile: true,
    },
  },
})
