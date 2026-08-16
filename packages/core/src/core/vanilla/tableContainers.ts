import type { DOMManager } from "../dom/DOMManager";

export const getBodyContainers = (domManager: DOMManager): HTMLElement[] => {
  const refs = domManager.getRefs();
  return [
    refs.mainBodyRef.current,
    refs.pinnedLeftRef.current,
    refs.pinnedRightRef.current,
  ].filter((el): el is HTMLDivElement => el !== null);
};

export const getHeaderContainers = (domManager: DOMManager): HTMLElement[] => {
  const refs = domManager.getRefs();
  return [
    refs.mainHeaderRef.current,
    refs.pinnedLeftHeaderRef.current,
    refs.pinnedRightHeaderRef.current,
  ].filter((el): el is HTMLDivElement => el !== null);
};

/** Body and header sections the animation coordinator inspects for FLIP. */
export const getAnimatableContainers = (domManager: DOMManager): HTMLElement[] => [
  ...getBodyContainers(domManager),
  ...getHeaderContainers(domManager),
];
