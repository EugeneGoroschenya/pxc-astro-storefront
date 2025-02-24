interface ProductAPI {
    // search products with pagination and sorting
    search(params: ProductSearchParams): PaginatedProductResult;

    // get product by catalogId, productId and optionally by revision
    get(catalogId: string, productId: string, revision?: string): Product;
}

//  Search Query Params
type ProductSearchParams = {
    q?: string; // Free-text search (fuzzy matching supported)
    classificationId?: Category['classificationId'];
    categoryId?: Category['categoryId'];
    manufacturerId?: Manufacturer['manufacturerId'];
    attributes?: AttributeFilter[]; // Attribute-based filtering
    price?: RangeFilter; // Price range filter
    stockStatus?: Product['stock']['status'] | 'all'; // Stock filter
    sort?: Sort; // Sorting option
    page?: Page; // Page number & size
    includeFacets?: boolean; // Whether to return facet aggregations
};

//  Attribute Filtering (supports single & range values)
type AttributeFilter = {
    attributeId: string; // Attribute ID (e.g., "color", "voltage")
    values?: (string | number)[]; // Exact match values (e.g., ["red", "blue"])
    range?: RangeFilter; // range filtering (e.g., power 10-100W)
};

// Range Filter
type RangeFilter = {
    from?: number | string;
    to?: number | string;
};

// Sorting Options
type Sort =
    | { field: 'price'; order: 'asc' | 'desc' }
    | { field: 'name'; order: 'asc' | 'desc' }
    | { field: 'updatedAt'; order: 'asc' | 'desc' }
    | { field: 'createdAt'; order: 'asc' | 'desc' };

// Pagination Parameters
type Page = {
    page: number; // Page number (1-based)
    limit: number; // Items per page
};

// Paginated result type
type PaginatedProductResult = {
    total: number; // Total results count
    page: number; // Current page number
    limit: number; // Items per page

    products: Product[]; // List of products for page

    // Aggregated facet counts (for filters)
    facets?: {
        // children for category in search params
        categories: {
            classificationId: string;
            categoryId: string;
            count: number;
        }[];
        attributes: {
            attributeId: string;
            count: number;
            values: {
                value: string | number;
                count: number;
            }[];
        }[];
        manufacturers: {
            manufacturerId: string;
            count: number;
        }[];
    };
};

const productSearchParams: ProductSearchParams = {
    q: 'industrial drill',
    categoryId: 'power-tools',
    attributes: [
        { attributeId: 'brand', values: ['Bosch', 'DeWalt'] },
        { attributeId: 'power', range: { from: 500, to: 2000 } },
    ],
    price: { from: 100, to: 500 },
    stockStatus: 'in_stock',
    sort: { field: 'price', order: 'desc' },
    page: { page: 1, limit: 20 },
};

const paginatedProductResult: PaginatedProductResult = {
    products: [
        {
            catalogId: 'prodexa',
            productId: '12345',
            sku: 'P12345',
            name: 'Bosch Industrial Drill',
            price: {
                currency: 'EUR',
                amount: 299.99,
            },
            stock: { status: 'in_stock', quantity: 1 },
            attributes: {
                brand: 'Bosch',
                power: 1200, // 1200W
                color: ['blue', 'black'],
            },
            images: ['https://example.com/drill.jpg'],
            createdAt: new Date('2025-02-20'),
        },
    ],
    page: 1,
    limit: 20,
    total: 100,
    facets: {
        categories: [],
        attributes: [
            {
                attributeId: 'power',
                count: 33,
                values: [
                    { value: 1200, count: 15 },
                    { value: 1500, count: 20 },
                ],
            },
        ],
        manufacturers: [],
    },
};
