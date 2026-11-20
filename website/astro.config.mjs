import { defineConfig } from 'astro/config';
import { deploymentConfig } from './src/deployment.mjs';

export default defineConfig({
  output: 'static',
  ...deploymentConfig(),
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
