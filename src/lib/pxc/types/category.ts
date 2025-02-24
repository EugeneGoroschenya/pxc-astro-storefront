/** Represents a category in a hierarchical structure. */
type Category = {
    /** Unique identifier for the category */
    classificationId: string;
    categoryId: string;

    /** Category name */
    name: string;

    /** Optional description of the category */
    description?: string;

    /** Optional parent category (null for top-level categories) */
    parent?: Category | null;

    /** List of child categories (recursive structure, null for lazy loading, [] no children) */
    children?: Category[];

    /** Attributes specific to this category type */
    attributes?: Attribute[];

    /** Optional image URL for category display */
    imageUrl?: string;
};
