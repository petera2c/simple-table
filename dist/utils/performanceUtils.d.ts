import HeaderObject from "../types/HeaderObject";
export declare const useThrottle: () => ({ callback, callbackProps, limit, }: {
    callback: (callbackProps: any) => void;
    callbackProps: any;
    limit: number;
}) => void;
export declare const logArrayDifferences: (original: HeaderObject[], updated: HeaderObject[]) => void;
