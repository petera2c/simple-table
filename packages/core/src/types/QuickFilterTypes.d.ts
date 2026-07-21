import { Accessor } from "./HeaderObject";
import Row from "./Row";
export type QuickFilterMode = "simple" | "smart";
export interface QuickFilterConfig {
    text: string;
    columns?: Accessor[];
    caseSensitive?: boolean;
    mode?: QuickFilterMode;
    useFormattedValue?: boolean;
    onChange?: (text: string) => void;
}
export interface QuickFilterGetterProps {
    row: Row;
    accessor: Accessor;
}
export type QuickFilterGetter = (props: QuickFilterGetterProps) => string;
export interface SmartFilterToken {
    type: "word" | "phrase" | "negation" | "columnSpecific";
    value: string;
    column?: Accessor;
}
