import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
const config = {
  extensions: ['.svx'],
  layout: {
    runbook
  }
};

export default config;
