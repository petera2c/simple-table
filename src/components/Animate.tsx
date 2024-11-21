import React, {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  useRef,
} from "react";
import usePrevious from "../hooks/usePrevious";
import calculateBoundingBoxes from "../helpers/calculateBoundingBoxes";
import BoundingBox from "../types/BoundingBox";

interface AnimateProps {
  allowHorizontalAnimate?: boolean;
  animationTime?: number;
  children: any;
  isBody?: boolean;
  pauseAnimation?: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const Animate = ({
  allowHorizontalAnimate = true,
  animationTime = 100,
  children,
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
    const newBoundingBox = calculateBoundingBoxes(children);

    setBoundingBox(newBoundingBox);
  }, [children, isBody]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren);
    setPrevBoundingBox(prevBoundingBox);

    const currentTableRef = tableRef.current; // Store the current ref value

    const handleScroll = () => {
      isScrolling.current = true;
      const prevBoundingBox = calculateBoundingBoxes(prevChildren);
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
  }, [prevChildren, tableRef]);

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

        const changeInX = prevBox.left - currentBox.left;
        const changeInY = !allowHorizontalAnimate
          ? prevBox.top - currentBox.top
          : 0;

        const absoluteChangeInX = Math.abs(changeInX);
        const absoluteChangeInY = Math.abs(changeInY);

        if (absoluteChangeInX > 10 || absoluteChangeInY > 10) {
          animationFrameId.current = requestAnimationFrame(() => {
            // Before the DOM paints, invert child to old position
            domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
            domNode.style.transition = "transform 0s";

            animationFrameId.current = requestAnimationFrame(() => {
              // After the previous frame, remove the transition to play the animation
              domNode.style.transform = "";
              domNode.style.transition = `transform ${animationTime}ms linear`;
            });
          });
        }
      });
    }
  }, [
    allowHorizontalAnimate,
    animationTime,
    boundingBox,
    children,
    pauseAnimation,
    prevBoundingBox,
    isBody,
  ]);

  return children;
};

export default Animate;
