import { cloneElement, FC, ReactElement, RefObject, useCallback, useEffect, useRef } from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

const GROUPS = ["default"];

interface ScrollSyncPaneProps {
  childRef: RefObject<HTMLElement | null>;
  children: ReactElement<any>;
}

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({ childRef, children }) => {
  const context = useScrollSyncContext();
  const nodeRef = useRef<HTMLElement | null>(null);

  const updateNode = useCallback(() => {
    nodeRef.current = childRef.current;
  }, [childRef]);

  useEffect(() => {
    updateNode();

    if (nodeRef.current) {
      context.registerPane(nodeRef.current, GROUPS);
    }
    return () => {
      if (nodeRef.current) {
        context.unregisterPane(nodeRef.current, GROUPS);
      }
    };
  }, [context, updateNode]);

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      childRef.current = node;
    },
  });
};
