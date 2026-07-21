import HeaderObject from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
export declare const deepClone: <T>(obj: T) => T;
export declare const canDisplaySection: (headers: HeaderObject[], pinned?: Pinned) => boolean;
