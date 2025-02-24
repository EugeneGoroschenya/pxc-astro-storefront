/** Represents a single attribute in a category. */
type Attribute = {
    /** Unique identifier for the attribute */
    attributeId: string;

    /** Name of the attribute (e.g., "Voltage", "Material") */
    name: string;

    /** Data type of the attribute (e.g., string, number, boolean) */
    type: 'string' | 'markdown' | 'integer' | 'decimal' | 'boolean' | 'date';

    /** Optional unit of measure */
    unit?: UnitOfMeasure;

    /** Optional predefined values */
    options?: Option[];

    /** Optional attribute section */
    attributeSection?: AttributeSection;
};

/** Represents an option for an attribute. */
type Option = {
    /** The actual stored value (e.g., "ssd", "hdd") */
    value: string | number; // TODO additional types?

    /** The human-readable name for UI display (e.g., "Solid State Drive", "Hard Disk Drive") */
    name: string;
};

/** Represents a unit of measure */
type UnitOfMeasure = {
    /** Unique identifier or standard code */
    unitOfMeasureId: string;

    /** Symbol, which shortly represents unit of measure (e.g., "kg", "m", "W"). */
    symbol: string;

    /** Full name of the unit (e.g., "Kilogram", "Meter", "Watt") */
    name: string;
};

/** Represents an attribute section  */
type AttributeSection = {
    /** Unique identifier */
    sectionId: string;

    /** Name of the section (e.g., "General Specs", "Performance", "Dimensions") */
    name: string;
};
