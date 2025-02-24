/** Represents a product in the PXC */
type Product = {
    /** Unique identifier for the product */
    catalogId: string;
    productId: string;
    revision?: string | number; // string or number? LATER

    /** Stock Keeping Unit (SKU), a unique identifier for tracking */
    sku: string;

    /** Product name */
    name: string;

    /** Optional detailed description of the product */
    description?: string;

    /** Optional GTIN/EAN for the product */
    gtin?: string;

    /** Optional list of image URLs for the product */
    images?: string[];

    /** Optional list of categories the product belongs to */
    categories?: Category[];

    /** Optional manufacturer of the product */
    manufacturer?: Manufacturer;

    /** Custom attributes for the product (e.g., material, weight, voltage) */
    attributes?: ProductAttributes;

    /** Optional list of product variants */
    variants?: ProductVariant[];

    /** Optional related products */
    relatedProducts?: RelatedProducts;

    /** Stock details, including quantity and availability status */
    stock: Stock;

    /** Standard pricing details (base price, bulk discounts) */
    price: Price;

    /** Optional customer-specific pricing rules */
    customerPricing?: CustomerPricing[];

    /** Supplier details, including price and stock per supplier */
    suppliers?: SupplierInfo[];

    /** Date when the product was created */
    createdAt: Date;

    /** Optional date when the product was last updated */
    updatedAt?: Date;
};

/** Represents a variant of a product, with its own SKU, price, stock, and attributes. */
type ProductVariant = {
    /** Unique identifier for the product variant */
    catalogId: string;
    productId: string;
    variantId: string;
    revision?: string | number; // string or number? LATER

    /** Stock Keeping Unit (SKU) for the variant */
    sku: string;

    /** Optional variant-specific name (e.g., "Industrial Drill - Red") */
    name: string;

    /** Optional GTIN/EAN for the variant */
    gtin?: string;

    /** Optional list of image URLs for the variant */
    images?: string[];

    /** Stock details for this specific variant */
    stock: Stock;

    /** Variant-specific attributes (e.g., color, weight) */
    attributes: ProductAttributes;

    /** Optional variant-specific pricing details */
    price?: Price;

    /** Optional customer-specific pricing for this variant */
    customerPricing?: CustomerPricing[];

    /** Supplier details for this variant */
    suppliers?: SupplierInfo[];
};

/** Represents a collection of attributes for a product or variant. Supports various data types. */
type ProductAttributes = {
    [key: Attribute['attributeId']]: AttributeValue;
};

/** Represents a flexible attribute value that can be of different types. */
type AttributeValue =
    | string
    | number
    | boolean
    // for 'date' type, Example: {year: 2025, month: 2, day: 21}
    | { year: number; month: number; day: number }
    // for multivalued, Example: ["Small", "Medium", "Large"], [10, 20, 30] (e.g., weight options)
    | AttributeValue[]
    // for composite
    | ProductAttributes;

/** Represents a manufacturer of a product. */
type Manufacturer = {
    /** Unique identifier for the manufacturer */
    manufacturerId: string;

    /** Manufacturer name (e.g., "Apple", "Samsung") */
    name: string;

    /** Optional manufacturer logo */
    logoUrl?: string;
};

/** Represents a collection of related products grouped by relationship type. */
type RelatedProducts = {
    [typeId: ProductRelationType['typeId']]: Product[];
};

/** Represents a type of product relation with its name. */
type ProductRelationType = {
    /** Unique identifier for the relation type (e.g. "similar", "accessory") */
    typeId: string;

    /** The human-readable name for UI display (e.g., "Similar to", "Has accessories") */
    name: string;
};

/** Represents pricing details of a product or variant. */
type Price = {
    /** Currency code (e.g., "USD", "EUR") */
    currency: string;

    /** Base price per unit */
    amount: number;

    /** Optional bulk pricing rules. Example: Buy 10+ units for a discounted price. */
    bulkPricing?: {
        /** Minimum quantity required for the discount */
        minQuantity: number;

        /** Discounted price per unit */
        discountPrice: number;
    }[];
};

/** Represents customer-specific pricing for a product or variant. */
type CustomerPricing = {
    /** The customer ID or customer group this pricing applies to */
    customerId: string | 'ALL_CUSTOMERS';

    /** Special price for this customer */
    price: Price;
};

/** Represents stock information for a product or variant. */
type Stock = {
    /** Current quantity available in inventory */
    quantity: number;

    /** Stock availability status */
    status: 'in_stock' | 'out_of_stock';
};

/** Represents supplier information for a product or variant. */
type SupplierInfo = {
    /** Unique identifier for the supplier */
    supplierId: string;

    /** Supplier name */
    name: string;

    /** The price at which the supplier provides the product */
    price: Price;

    /** Stock levels provided by the supplier */
    stock: Stock;

    /** Expected lead time in days for fulfillment */
    leadTimeDays?: number;
};
