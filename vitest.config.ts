import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './src/server/.vitest/setEnvVars.ts',
  },
});
