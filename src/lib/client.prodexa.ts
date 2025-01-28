// This file contains mock functions for all storefront services.
// You can use this as a template to connect your own ecommerce provider.

import type { Options, RequestResult } from '@hey-api/client-fetch';
import type {
	Collection,
	CreateCustomerData,
	CreateCustomerError,
	CreateCustomerResponse,
	CreateOrderData,
	CreateOrderError,
	CreateOrderResponse,
	GetCollectionByIdData,
	GetCollectionByIdError,
	GetCollectionByIdResponse,
	GetCollectionsData,
	GetCollectionsError,
	GetCollectionsResponse,
	GetOrderByIdData,
	GetOrderByIdError,
	GetOrderByIdResponse,
	GetProductByIdData,
	GetProductByIdError,
	GetProductByIdResponse,
	GetProductsData,
	GetProductsError,
	GetProductsResponse,
	Order,
	Product,
} from './client.types.ts';

import { config } from '~/config.ts';

export * from './client.types.ts';

const language = config.language;

// /MasterClassification/Commodities/Wearables/Smartwatches
// /MasterClassification/Commodities/Tablets
const categories = ['Smartwatches', 'Tablets'];

const page = { offset: 0, limit: 9999 };

const baseApiUrl = 'http://localhost:8080/pxm/';

const productsApiUrl = `${baseApiUrl}api/products/search/full-product?page=${page.offset}&size=${page.limit}&language=${language}`;
const workareaApiUrl = `${baseApiUrl}workarea/`;

const products: Record<string, Product> = {};

export const getProducts = async <ThrowOnError extends boolean = false>(
	options?: Options<GetProductsData, ThrowOnError>,
): Promise<RequestResult<GetProductsResponse, GetProductsError, ThrowOnError>> => {
	const response = await fetch(productsApiUrl, {
		headers: {
			PXM_USER: 'admin',
			'content-type': 'application/json',
		},
		body: '{"searchParams":{},"facetParams":{}}',
		method: 'POST',
	});

	const getGroupsIds = (p): string[] =>
		p.productGroups?.map((g) => g.classificationGroupId).filter((id) => categories.includes(id)) ||
		[];
	const getPrice = (p) => p.prices?.find((pr) => pr.currencyId === config.currency)?.price;

	let items = ((await response.json()) as unknown as { content: Array<any> }).content
		.filter((p) => getGroupsIds(p).length)
		// .filter((p) => getPrice(p))
		.map((p) => {
			const documents = [
				...new Set(
					p.productDocuments
						?.sort((d) => (d.documentViewTypeId === 'preview' ? 1 : 0))
						?.filter(({ languageId, variantId }) => !variantId && (languageId === language || !languageId))
						?.map(({ path }) => path)
						?.filter((path) => !path?.toLocaleString()?.endsWith('.pdf')) || [],
				),
			];

			const previewPath = documents[0];

			const otherDocuments = Array.from(documents).splice(1);

			const imageUrl = (previewPath && workareaApiUrl + previewPath) || '/no-img.png';
			const price = getPrice(p);

			const collectionIds = [...getGroupsIds(p), price ? 'bestSellers' : null];
			return {
				...productDefaults,

				id: p.productId,
				name: p.values?.ShortDescription?.[language] || p.productId,
				slug: p.productId,
				tagline: p.values?.MC_MarketingDesc?.[language],
				imageUrl,
				collectionIds: collectionIds,

				price: price ? price * 100 : 50 * 100 + Math.random() * 50 * 100,
				description: p.values?.LongDescription?.[language],

				images: otherDocuments.map((id) => ({ id, url: workareaApiUrl + id })),

				discount: price > 300 ? 100 * 5 : 0,

				variants: [
					{
						id: p.productId,
						name: 'Default',
						stock: 9999,
						options: {},
					},
				],
			} as Product;
		});

	items.forEach((p) => {
		products[p.id] = p;
	});

	if (options?.query?.collectionId) {
		const collectionId = options.query.collectionId;
		items = items.filter((product) => product.collectionIds?.includes(collectionId));
	}

	if (options?.query?.ids) {
		const ids = Array.isArray(options.query.ids) ? options.query.ids : [options.query.ids];
		items = items.filter((product) => ids.includes(product.id));
	}

	if (options?.query?.sort && options?.query?.order) {
		const { sort, order } = options.query;
		if (sort === 'price') {
			items = items.sort((a, b) => {
				return order === 'asc' ? a.price - b.price : b.price - a.price;
			});
		} else if (sort === 'name') {
			items = items.sort((a, b) => {
				return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			});
		}
	}

	return {
		data: { items, next: null },
		error: undefined,
		request: new Request('https://example.com'),
		response: new Response(),
	} as unknown as RequestResult<GetProductsResponse, GetProductsError, ThrowOnError>;
};

export const getProductById = <ThrowOnError extends boolean = false>(
	options: Options<GetProductByIdData, ThrowOnError>,
): RequestResult<GetProductByIdResponse, GetProductByIdError, ThrowOnError> => {
	const product = products[options.path.id];
	if (!product) {
		const error = asError<GetProductByIdError>({ error: 'not-found' });
		if (options.throwOnError) throw error;
		return error as RequestResult<GetProductByIdResponse, GetProductByIdError, ThrowOnError>;
	}
	return asResult(product);
};

export const getCollections = <ThrowOnError extends boolean = false>(
	_options?: Options<GetCollectionsData, ThrowOnError>,
): RequestResult<GetCollectionsResponse, GetCollectionsError, ThrowOnError> => {
	return asResult({ items: Object.values(collections), next: null });
};

export const getCollectionById = <ThrowOnError extends boolean = false>(
	options: Options<GetCollectionByIdData, ThrowOnError>,
): RequestResult<GetCollectionByIdResponse, GetCollectionByIdError, ThrowOnError> => {
	const collection = collections[options.path.id];
	if (!collection) {
		const error = asError<GetCollectionByIdError>({ error: 'not-found' });
		if (options.throwOnError) throw error;
		return error as RequestResult<GetCollectionByIdResponse, GetCollectionByIdError, ThrowOnError>;
	}
	return asResult({ ...collection, products: [] });
};

export const createCustomer = <ThrowOnError extends boolean = false>(
	options?: Options<CreateCustomerData, ThrowOnError>,
): RequestResult<CreateCustomerResponse, CreateCustomerError, ThrowOnError> => {
	if (!options?.body) throw new Error('No body provided');
	return asResult({
		...options.body,
		id: options.body.id ?? 'customer-1',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		deletedAt: null,
	});
};

const orders: Record<string, Order> = {};

export const createOrder = <ThrowOnError extends boolean = false>(
	options?: Options<CreateOrderData, ThrowOnError>,
): RequestResult<CreateOrderResponse, CreateOrderError, ThrowOnError> => {
	if (!options?.body) throw new Error('No body provided');
	const order: Order = {
		...options.body,
		id: 'dk3fd0sak3d',
		number: 1001,
		lineItems: options.body.lineItems.map((lineItem) => ({
			...lineItem,
			id: crypto.randomUUID(),
			productVariant: getProductVariantFromLineItemInput(lineItem.productVariantId),
		})),
		billingAddress: getAddress(options.body.billingAddress),
		shippingAddress: getAddress(options.body.shippingAddress),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		deletedAt: null,
	};
	orders[order.id] = order;
	return asResult(order);
};

export const getOrderById = <ThrowOnError extends boolean = false>(
	options: Options<GetOrderByIdData, ThrowOnError>,
): RequestResult<GetOrderByIdResponse, GetOrderByIdError, ThrowOnError> => {
	const order = orders[options.path.id];
	if (!order) {
		const error = asError<GetOrderByIdError>({ error: 'not-found' });
		if (options.throwOnError) throw error;
		return error as RequestResult<GetOrderByIdResponse, GetOrderByIdError, ThrowOnError>;
	}
	return asResult(order);
};

const collectionDefaults = {
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	deletedAt: null,
};

const collections: Record<string, Collection> = {
	Smartwatches: {
		id: 'Smartwatches',
		name: 'Smart Watches',
		description: 'Smart Watches.',
		slug: 'Smartwatches',
		imageUrl: '/assets/sm.png',
		...collectionDefaults,
	},
	Tablets: {
		id: 'Tablets',
		name: 'Tablets',
		description: 'Tablets.',
		slug: 'Tablets',
		imageUrl: '/assets/tablets.png',
		...collectionDefaults,
	},
	bestSellers: {
		id: 'bestSellers',
		name: 'Best Sellers',
		description: "You'll love these.",
		slug: 'bestSellers',
		imageUrl: '/assets/bs.png',
		...collectionDefaults,
	},
};

const productDefaults = {
	description: '',
	images: [],
	variants: [
		{
			id: 'default',
			name: 'Default',
			stock: 20,
			options: {},
		},
	],
	discount: 0,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	deletedAt: null,
};

function asResult<T>(data: T) {
	return Promise.resolve({
		data,
		error: undefined,
		request: new Request('https://example.com'),
		response: new Response(),
	});
}

function asError<T>(error: T) {
	return Promise.resolve({
		data: undefined,
		error,
		request: new Request('https://example.com'),
		response: new Response(),
	});
}

function getAddress(address: Required<CreateOrderData>['body']['shippingAddress']) {
	return {
		line1: address?.line1 ?? '',
		line2: address?.line2 ?? '',
		city: address?.city ?? '',
		country: address?.country ?? '',
		province: address?.province ?? '',
		postal: address?.postal ?? '',
		phone: address?.phone ?? null,
		company: address?.company ?? null,
		firstName: address?.firstName ?? null,
		lastName: address?.lastName ?? null,
	};
}

function getProductVariantFromLineItemInput(
	variantId: string,
): NonNullable<Order['lineItems']>[number]['productVariant'] {
	for (const product of Object.values(products)) {
		for (const variant of product.variants) {
			if (variant.id === variantId) {
				return { ...variant, product };
			}
		}
	}
	throw new Error(`Product variant ${variantId} not found`);
}
