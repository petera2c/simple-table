import {
  cloneElement,
  FC,
  ReactElement,
  RefCallback,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useScrollSyncContext } from "../../context/useScrollSyncContext";

export interface ScrollSyncPaneProps {
  /**
   * Optionally attach scroll sync to an external HTMLElement ref or callback.
   * If provided, the pane will sync scroll with this element instead of the child.
   */
  attachTo?: RefCallback<HTMLElement> | RefObject<HTMLElement>;

  /**
   * The scrollable child element to be synchronized.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any>;

  /**
   * Group or groups this pane belongs to for scroll synchronization.
   * Panes in the same group will sync scroll positions.
   * @default 'default'
   */
  group?: string | string[];

  /**
   * Ref or callback to access the underlying HTMLElement of the pane.
   */
  innerRef?: RefCallback<HTMLElement> | RefObject<HTMLElement>;
}

const castArray = (groups: string | string[]): string[] =>
  Array.isArray(groups) ? groups : [groups];

export const ScrollSyncPane: FC<ScrollSyncPaneProps> = ({
  attachTo,
  children,
  group = "default",
  innerRef,
}) => {
  const context = useScrollSyncContext();
  const childRef = useRef<HTMLElement | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  const updateNode = useCallback(() => {
    if (attachTo) {
      nodeRef.current = typeof attachTo === "function" ? null : attachTo.current;
    } else {
      nodeRef.current = childRef.current;
    }
  }, [attachTo]);

  useEffect(() => {
    updateNode();

    if (nodeRef.current) {
      context.registerPane(nodeRef.current, castArray(group));
    }
    return () => {
      if (nodeRef.current) {
        context.unregisterPane(nodeRef.current, castArray(group));
      }
    };
  }, [context, group, attachTo, updateNode]);

  if (attachTo) {
    return children;
  }

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      childRef.current = node;
      if (typeof innerRef === "function") {
        innerRef(node);
      } else if (innerRef && node) {
        innerRef.current = node;
      }
    },
  });
};
