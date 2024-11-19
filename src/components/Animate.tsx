import React, {
  useState,
  useLayoutEffect,
  useEffect,
  RefObject,
  useRef,
} from "react";
import usePrevious from "../hooks/usePrevious";
import calculateBoundingBoxes from "../helpers/calculateBoundingBoxes";

interface AnimateProps {
  allowHorizontalAnimate?: boolean;
  animationTime?: number;
  children: any;
  pauseAnimation?: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const Animate = ({
  allowHorizontalAnimate = true,
  animationTime = 8000,
  children,
  pauseAnimation,
  tableRef,
}: AnimateProps) => {
  // Refs
  const isScrolling = useRef(false);

  // Local state
  const [boundingBox, setBoundingBox] = useState<any>({});
  const [prevBoundingBox, setPrevBoundingBox] = useState<any>({});

  // Hooks
  const prevChildren = usePrevious(children);

  // Add a ref to store the animation frame ID
  const animationFrameId = useRef<number | null>(null);

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children);
    setBoundingBox(newBoundingBox);
  }, [children]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren);
    setPrevBoundingBox(prevBoundingBox);

    // console.log("\n");
    // console.log("prevChildren", prevChildren);
    // console.log("productId", prevBoundingBox.productId);
    // console.log("productName", prevBoundingBox.productName);

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
        const firstBox = prevBoundingBox[child.key];
        const lastBox = boundingBox[child.key];

        if (!firstBox || !lastBox) return;

        const changeInX = firstBox.left - lastBox.left;
        const changeInY = !allowHorizontalAnimate
          ? firstBox.top - lastBox.top
          : 0;

        const absoluteChangeInX = Math.abs(changeInX);
        const absoluteChangeInY = Math.abs(changeInY);

        if (absoluteChangeInX > 10 || absoluteChangeInY > 10) {
          // Cancel the previous animation frame if it exists
          if (animationFrameId.current !== null) {
            // cancelAnimationFrame(animationFrameId.current);
          }

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
  ]);

  return children;
};

export default Animate;
