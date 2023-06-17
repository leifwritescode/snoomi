/**
 * An aggregate type that is a union of discrete but compatible type variants.
 */
export type VariantRecord<T extends string> = { name: T };
