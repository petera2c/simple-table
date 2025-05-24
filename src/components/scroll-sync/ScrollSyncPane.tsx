import { cloneElement, FC, ReactElement, RefObject, useEffect } from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

const GROUPS = ["default"];

interface ScrollSyncPaneProps {
  childRef: RefObject<HTMLElement | null>;
  children: ReactElement<any>;
}

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({ childRef, children }) => {
  const { registerPane, unregisterPane } = useScrollSyncContext();

  useEffect(() => {
    if (childRef.current) registerPane(childRef.current, GROUPS);

    return () => {
      if (childRef.current) unregisterPane(childRef.current, GROUPS);
    };
  }, [childRef, registerPane, unregisterPane]);

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      childRef.current = node;
    },
  });
};
