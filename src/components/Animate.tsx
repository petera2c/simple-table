import React, {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  useRef,
  MutableRefObject,
} from "react";
import calculateBoundingBoxes from "../helpers/calculateBoundingBoxes";
import BoundingBox from "../types/BoundingBox";
import HeaderObject from "../types/HeaderObject";
import { getCellId } from "../utils/cellUtils";

// const MAX_CHANGE = 120;
// changeInX =
//   Math.sign(changeInX) * Math.min(Math.abs(changeInX), MAX_CHANGE);
// changeInY =
//   Math.sign(changeInY) * Math.min(Math.abs(changeInY), MAX_CHANGE);
const ANIMATION_TIME = 400;
export const TEST_KEY = "productId";

interface AnimateProps {
  allowHorizontalAnimate?: boolean;
  children: React.ReactNode | React.ReactNode[];
  draggedHeaderRef?: MutableRefObject<HeaderObject | null>;
  isBody?: boolean;
  pauseAnimation?: boolean;
  rowIndex: number;
  tableRef: RefObject<HTMLDivElement | null>;
  headersRef: RefObject<HeaderObject[]>;
}

const AnimateWrapper = ({
  allowAnimations,
  children,
  ...props
}: AnimateProps & {
  allowAnimations: boolean;
}) => {
  if (!allowAnimations) {
    return <>{children}</>;
  }
  return <Animate {...props}>{children}</Animate>;
};

const Animate = ({
  allowHorizontalAnimate = true,
  children,
  draggedHeaderRef,
  isBody,
  pauseAnimation,
  rowIndex,
  tableRef,
  headersRef,
}: AnimateProps) => {
  // Refs
  const isScrolling = useRef(false);

  // Local state
  const [boundingBox, setBoundingBox] = useState<{
    [key: string]: false | BoundingBox;
  }>({});
  const prevBoundingBox = useRef<{
    [key: string]: false | BoundingBox;
  }>({});

  // Derived state
  const currentHeaders = headersRef.current;

  useLayoutEffect(() => {
    if (!currentHeaders) return;
    const newBoundingBox = calculateBoundingBoxes({
      currentHeaders,
      draggedHeaderRef,
      rowIndex,
    });

    if (JSON.stringify(newBoundingBox) !== JSON.stringify(boundingBox)) {
      prevBoundingBox.current = boundingBox;

      // if (rowIndex === 0) {
      //   if (!newBoundingBox.productId) {
      //     console.log("newBoundingBox.productId", newBoundingBox.productId);
      //   } else {
      //     console.log("newBoundingBox.productId.x", newBoundingBox.productId.x);
      //   }
      // }
      setBoundingBox(newBoundingBox);
    }
  }, [boundingBox, currentHeaders, draggedHeaderRef, isBody, rowIndex]);

  useLayoutEffect(() => {
    const currentTableRef = tableRef.current;

    const handleScroll = () => {
      isScrolling.current = true;
    };

    const handleScrollEnd = () => {
      isScrolling.current = false;
    };

    currentTableRef?.addEventListener("scroll", handleScroll);
    currentTableRef?.addEventListener("scrollend", handleScrollEnd);
    return () => {
      currentTableRef?.removeEventListener("scroll", handleScroll);
      currentTableRef?.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [draggedHeaderRef, tableRef]);

  useEffect(() => {
    if (pauseAnimation || isScrolling.current) return;
    const hasPrevBoundingBox = Object.keys(prevBoundingBox.current).length;

    if (hasPrevBoundingBox && currentHeaders) {
      currentHeaders.forEach((header) => {
        const domNode = document.getElementById(
          getCellId({ accessor: header.accessor, rowIndex })
        );
        if (!domNode) return;
        const prevBox = prevBoundingBox.current[header.accessor];
        const currentBox = boundingBox[header.accessor];

        if (!prevBox || !currentBox) return;

        let changeInX = prevBox.left - currentBox.left;
        let changeInY = !allowHorizontalAnimate
          ? prevBox.top - currentBox.top
          : 0;

        const absoluteChangeInX = Math.abs(changeInX);
        const absoluteChangeInY = Math.abs(changeInY);

        if (absoluteChangeInX > 10 || absoluteChangeInY > 10) {
          requestAnimationFrame(() => {
            domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
            domNode.style.transition = "transform 0s";

            requestAnimationFrame(() => {
              domNode.style.transform = "";
              domNode.style.transition = `transform ${ANIMATION_TIME}ms ease-out`;
            });
          });
        }
      });
    }
  }, [
    allowHorizontalAnimate,
    boundingBox,
    currentHeaders,
    isBody,
    pauseAnimation,
    prevBoundingBox,
    rowIndex,
  ]);

  return <>{children}</>;
};

export default AnimateWrapper;
