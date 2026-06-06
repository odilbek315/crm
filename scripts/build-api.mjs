import { build } from 'esbuild';

await build({
  entryPoints: ['src/server/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'api/index.mjs',
  packages: 'external',
  banner: {
    js: "import 'dotenv/config';",
  },
  sourcemap: true,
});

console.log('✅ API bundled to api/index.mjs');
