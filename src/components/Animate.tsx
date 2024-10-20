import React, { useState, useLayoutEffect, useEffect } from "react";
import usePrevious from "../hooks/usePrevious";
import calculateBoundingBoxes from "../helpers/calculateBoundingBoxes";

interface AnimateProps {
  allowHorizontalAnimate?: boolean;
  children: any;
  pauseAnimation?: boolean;
}

const Animate = ({
  allowHorizontalAnimate = true,
  children,
  pauseAnimation,
}: AnimateProps) => {
  const [boundingBox, setBoundingBox] = useState<any>({});
  const [prevBoundingBox, setPrevBoundingBox] = useState<any>({});
  const prevChildren = usePrevious(children);

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children);
    setBoundingBox(newBoundingBox);
  }, [children]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren);
    setPrevBoundingBox(prevBoundingBox);
  }, [prevChildren]);

  useEffect(() => {
    if (pauseAnimation) return;
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
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
            domNode.style.transition = "transform 0s";

            requestAnimationFrame(() => {
              // After the previous frame, remove
              // the transition to play the animation
              domNode.style.transform = "";
              domNode.style.transition = "transform 500ms";
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
