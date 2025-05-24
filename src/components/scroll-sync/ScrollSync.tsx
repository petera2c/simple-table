import React, { FC, PropsWithChildren, useCallback, useRef } from "react";

import { ScrollSyncContext } from "../../context/useScrollSyncContext";

export interface ScrollSyncProps {
  /**
   * Callback fired after panes are synchronized.
   * Receives the scrolled HTMLElement as an argument.
   */
  onSync?: (el: HTMLElement) => void;
}
export const ScrollSync: FC<PropsWithChildren<ScrollSyncProps>> = ({ children, onSync }) => {
  const panesRef = useRef<Record<string, HTMLElement[]>>({});

  const findPane = useCallback((node: HTMLElement, group: string) => {
    if (!panesRef.current[group]) {
      return false;
    }
    return panesRef.current[group].find((pane) => pane === node);
  }, []);

  const syncScrollPosition = useCallback((scrolledPane: HTMLElement, pane: HTMLElement) => {
    const { clientWidth, scrollLeft, scrollWidth } = scrolledPane;

    const scrollLeftOffset = scrollWidth - clientWidth;

    if (scrollLeftOffset > 0) {
      pane.scrollLeft = scrollLeft;
    }
  }, []);

  const removeEvents = useCallback((node: HTMLElement) => {
    node.onscroll = null;
  }, []);

  const addEvents = useCallback(
    (node: HTMLElement, groups: string[]) => {
      node.onscroll = () => {
        window.requestAnimationFrame(() => {
          groups.forEach((group) => {
            panesRef.current[group]?.forEach((pane) => {
              /* For all panes beside the currently scrolling one */
              if (node !== pane) {
                removeEvents(pane);
                syncScrollPosition(node, pane);
                /* Re-attach event listeners after we're done scrolling */
                window.requestAnimationFrame(() => {
                  const paneGroups = Object.keys(panesRef.current).filter((paneGroup) =>
                    panesRef.current[paneGroup].includes(pane)
                  );
                  addEvents(pane, paneGroups);
                });
              }
            });
          });
        });

        if (onSync) {
          onSync(node);
        }
      };
    },
    [onSync, removeEvents, syncScrollPosition]
  );

  const registerPane = useCallback(
    (node: HTMLElement, groups: string[]) => {
      groups.forEach((group) => {
        if (!panesRef.current[group]) {
          panesRef.current[group] = [];
        }

        if (!findPane(node, group)) {
          if (panesRef.current[group].length > 0) {
            syncScrollPosition(panesRef.current[group][0], node);
          }
          panesRef.current[group].push(node);
        }
      });
      addEvents(node, groups);
    },
    [findPane, syncScrollPosition, addEvents]
  );

  const unregisterPane = useCallback(
    (node: HTMLElement, groups: string[]) => {
      groups.forEach((group) => {
        if (findPane(node, group)) {
          removeEvents(node);
          const index = panesRef.current[group].indexOf(node);
          if (index !== -1) {
            panesRef.current[group].splice(index, 1);
          }
        }
      });
    },
    [findPane, removeEvents]
  );

  return (
    <ScrollSyncContext.Provider value={{ registerPane, unregisterPane }}>
      {React.Children.only(children)}
    </ScrollSyncContext.Provider>
  );
};
