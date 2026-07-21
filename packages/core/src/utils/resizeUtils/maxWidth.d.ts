import type HeaderObject from "../../types/HeaderObject";
/**
 * Calculate the maximum allowable width for a header based on container constraints
 */
export declare const calculateMaxHeaderWidth: ({ header, headers, collapsedHeaders, }: {
    header: HeaderObject;
    headers: HeaderObject[];
    collapsedHeaders?: Set<string>;
}) => number;
