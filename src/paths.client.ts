import type { Product } from './lib/client.ts';

// export const productPath = (slug: Product['slug']) => `/products/${slug}`;

export const productPathClient = (slug: Product['slug'], storeId: string | null | undefined) => {
	return `/stores/${storeId || ''}/products/${slug}`;
};

export const collectionPathClient = (slug: string, storeId: string | null | undefined) => {
	return `/stores/${storeId || ''}/collections/${slug}`;
};
