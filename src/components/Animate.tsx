import React, {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  useRef,
  MutableRefObject,
} from "react";
import usePrevious from "../hooks/usePrevious";
import calculateBoundingBoxes from "../helpers/calculateBoundingBoxes";
import BoundingBox from "../types/BoundingBox";
import HeaderObject from "../types/HeaderObject";

const ANIMATION_TIME = 150;
// const MAX_CHANGE = 120;

interface AnimateProps {
  allowHorizontalAnimate?: boolean;
  children: any;
  draggedHeaderRef?: MutableRefObject<HeaderObject | null>;
  isBody?: boolean;
  pauseAnimation?: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const Animate = ({
  allowHorizontalAnimate = true,
  children,
  draggedHeaderRef,
  isBody,
  pauseAnimation,
  tableRef,
}: AnimateProps) => {
  // Refs
  const isScrolling = useRef(false);

  // Local state
  const [boundingBox, setBoundingBox] = useState<{
    [key: string]: false | BoundingBox;
  }>({});
  const [prevBoundingBox, setPrevBoundingBox] = useState<{
    [key: string]: false | BoundingBox;
  }>({});

  // Hooks
  const prevChildren = usePrevious(children);

  // Add a ref to store the animation frame ID
  const animationFrameId = useRef<number | null>(null);

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes({
      children,
      draggedHeaderRef,
    });

    setBoundingBox(newBoundingBox);
  }, [children, draggedHeaderRef, isBody]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes({
      children: prevChildren,
      draggedHeaderRef,
    });
    setPrevBoundingBox(prevBoundingBox);

    const currentTableRef = tableRef.current; // Store the current ref value

    const handleScroll = () => {
      isScrolling.current = true;
      const prevBoundingBox = calculateBoundingBoxes({
        children: prevChildren,
        draggedHeaderRef,
      });
      setBoundingBox(prevBoundingBox);
      setPrevBoundingBox(prevBoundingBox);
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
  }, [draggedHeaderRef, prevChildren, tableRef]);

  useEffect(() => {
    if (pauseAnimation || isScrolling.current) return;
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
        if (!child) return;
        const domNode = child.ref.current;
        const prevBox = prevBoundingBox[child.key];
        const currentBox = boundingBox[child.key];

        if (!prevBox || !currentBox) return;

        let changeInX = prevBox.left - currentBox.left;
        let changeInY = !allowHorizontalAnimate
          ? prevBox.top - currentBox.top
          : 0;

        // changeInX =
        //   Math.sign(changeInX) * Math.min(Math.abs(changeInX), MAX_CHANGE);
        // changeInY =
        //   Math.sign(changeInY) * Math.min(Math.abs(changeInY), MAX_CHANGE);

        const absoluteChangeInX = Math.abs(changeInX);
        const absoluteChangeInY = Math.abs(changeInY);

        if (absoluteChangeInX > 10 || absoluteChangeInY > 10) {
          animationFrameId.current = requestAnimationFrame(() => {
            domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
            domNode.style.transition = "transform 0s";

            domNode.style.mixBlendMode = "multiply";

            animationFrameId.current = requestAnimationFrame(() => {
              domNode.style.transform = "";
              domNode.style.transition = `transform ${ANIMATION_TIME}ms ease-in-out`;

              setTimeout(() => {
                domNode.style.mixBlendMode = "";
              }, ANIMATION_TIME);
            });
          });
        }
      });
    }
  }, [
    allowHorizontalAnimate,
    boundingBox,
    children,
    pauseAnimation,
    prevBoundingBox,
    isBody,
  ]);

  return children;
};

export default Animate;
