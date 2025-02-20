import { defineConfig } from 'astro/config';
import { astroConfig } from './../astro.config';

const shop = 'prodexa';

// https://astro.build/config
export default defineConfig({
	...astroConfig,
	outDir: `dist/${shop}`,
	srcDir: `./stores/${shop}`,
});
