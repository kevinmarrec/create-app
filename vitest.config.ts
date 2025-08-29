import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['text', 'text-summary'],
    },
  },
})
