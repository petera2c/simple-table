import React, { FC, PropsWithChildren, useCallback, useRef } from "react";

import { ScrollSyncContext } from "../../context/useScrollSyncContext";
import { syncScrollLeft, hasScrollableContent } from "../../utils/scrollSyncUtils";

export interface ScrollSyncProps {}
export const ScrollSync: FC<PropsWithChildren<ScrollSyncProps>> = ({ children }) => {
  const panesRef = useRef<Record<string, HTMLElement[]>>({});

  const findPane = useCallback((node: HTMLElement, group: string) => {
    if (!panesRef.current[group]) {
      return false;
    }
    return panesRef.current[group].find((pane) => pane === node);
  }, []);

  const syncScrollPosition = useCallback((scrolledPane: HTMLElement, pane: HTMLElement) => {
    // Only sync if there's scrollable content
    if (hasScrollableContent(scrolledPane)) {
      syncScrollLeft(scrolledPane, pane);
    }
  }, []);

  const removeEvents = useCallback((node: HTMLElement) => {
    node.onscroll = null;
  }, []);

  const addEvents = useCallback(
    (node: HTMLElement, groups: string[]) => {
      let rafId: number | null = null;
      
      node.onscroll = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = window.requestAnimationFrame(() => {
          groups.forEach((group) => {
            panesRef.current[group]?.forEach((pane) => {
              if (node !== pane) {
                removeEvents(pane);
                syncScrollPosition(node, pane);
                window.requestAnimationFrame(() => {
                  const paneGroups = Object.keys(panesRef.current).filter((paneGroup) =>
                    panesRef.current[paneGroup].includes(pane)
                  );
                  addEvents(pane, paneGroups);
                });
              }
            });
          });
          rafId = null;
        });
      };
    },
    [removeEvents, syncScrollPosition]
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
