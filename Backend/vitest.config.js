// vitest.config.js
//
// "globals: true" makes describe/it/expect/vi available everywhere
// without importing them in every test file — same ergonomics as Jest.
// This is why db.test.js and auth.service.test.js didn't need an
// `import { describe, it, expect } from 'vitest'` line originally.

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});