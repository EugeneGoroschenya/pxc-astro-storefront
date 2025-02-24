interface AttributeAPI {
    get(id: string): Attribute;
}

interface CategoryAPI {
    get(classificationId: string, categoryId: string): Category;
}

interface ManufacturerAPI {
    get(id: string): Manufacturer;
}
