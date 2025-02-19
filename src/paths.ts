import type { Product } from './lib/client.ts';
import Astro from 'astro:global';
import { collectionPathClient, productPathClient } from '~/paths.client.ts';

// export const productPath = (slug: Product['slug']) => `/products/${slug}`;

export const productPath = (slug: Product['slug']) => {
	return productPathClient(slug, Astro.locals.store);
};

export const collectionPath = (slug: string) => {
	return collectionPathClient(slug, Astro.locals?.store);
};
