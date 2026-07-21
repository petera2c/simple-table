import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
export declare const createEditableInput: (header: HeaderObject, context: HeaderRenderContext, labelContainer: HTMLElement) => HTMLInputElement;
export declare const createLabelContent: (header: HeaderObject, context: HeaderRenderContext, labelOverride?: string) => HTMLElement;
