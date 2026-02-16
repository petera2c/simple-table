import { cloneElement, FC, ReactElement, useEffect, RefObject } from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

interface ScrollSyncPaneProps {
  childRef: RefObject<HTMLElement | null>;
  children: ReactElement<any>;
  group?: string; // Optional group name for sync (defaults to "default")
}

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({
  childRef,
  children,
  group = "default",
}) => {
  const { registerPane, unregisterPane } = useScrollSyncContext();

  useEffect(() => {
    const groups = [group];
    if (childRef.current) registerPane(childRef.current, groups);

    return () => {
      if (childRef.current) unregisterPane(childRef.current, groups);
    };
  }, [childRef, registerPane, unregisterPane, group]);

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      // @ts-ignore
      childRef.current = node;
    },
  });
};
