import { ReactNode } from "react";
type HeaderObject = {
    label: string;
    accessor: string;
    width: number;
    cellRenderer?: (row: {
        [key: string]: any;
    }) => ReactNode;
};
export default HeaderObject;
