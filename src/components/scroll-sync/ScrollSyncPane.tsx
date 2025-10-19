import { cloneElement, FC, ReactElement, MutableRefObject, useEffect } from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

interface ScrollSyncPaneProps {
  childRef: MutableRefObject<HTMLElement | null>;
  children: ReactElement<any>;
  group?: string; // Optional group name for sync (defaults to "default")
}

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({
  childRef,
  children,
  group = "default",
}) => {
  const { registerPane, unregisterPane } = useScrollSyncContext();
  const groups = [group];

  useEffect(() => {
    if (childRef.current) registerPane(childRef.current, groups);

    return () => {
      if (childRef.current) unregisterPane(childRef.current, groups);
    };
  }, [childRef, registerPane, unregisterPane, group]);

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      childRef.current = node;
    },
  });
};
