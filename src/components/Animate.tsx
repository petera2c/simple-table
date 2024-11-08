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
  children: any;
  pauseAnimation?: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const Animate = ({
  allowHorizontalAnimate = true,
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

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children);
    setBoundingBox(newBoundingBox);
  }, [children]);

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
          requestAnimationFrame(() => {
            // Before the DOM paints, invert child to old position
            domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
            domNode.style.transition = "transform 0s, opacity 0s";
            // domNode.style.opacity = "0.5"; // Optional: Add a fade effect

            requestAnimationFrame(() => {
              // After the previous frame, remove the transition to play the animation
              domNode.style.transform = "";
              domNode.style.transition =
                "transform 300ms ease-out, opacity 300ms ease-out";
              // domNode.style.opacity = "1"; // Optional: Restore opacity
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
  ]);

  return children;
};

export default Animate;
