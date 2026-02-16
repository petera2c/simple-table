import { cloneElement, FC, ReactElement, Ref, useEffect, useRef } from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

interface ScrollSyncPaneProps {
  childRef: Ref<HTMLElement>;
  children: ReactElement<any>;
  group?: string; // Optional group name for sync (defaults to "default")
}

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({
  childRef,
  children,
  group = "default",
}) => {
  const { registerPane, unregisterPane } = useScrollSyncContext();
  const internalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const groups = [group];
    if (internalRef.current) registerPane(internalRef.current, groups);

    return () => {
      if (internalRef.current) unregisterPane(internalRef.current, groups);
    };
  }, [registerPane, unregisterPane, group]);

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      internalRef.current = node;
      
      // Forward the ref to the parent
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
        (childRef as any).current = node;
      }
    },
  });
};
