import { defineConfig } from '@prisma/client'

export default defineConfig({
  seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts'
})
