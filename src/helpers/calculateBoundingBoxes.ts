import { Children } from "react";

interface BoundingBox {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

const calculateBoundingBoxes = (
  children: any
): { [key: string]: BoundingBox } => {
  const boundingBoxes: { [key: string]: BoundingBox } = {};

  Children.forEach(children, (child: any) => {
    if (!child) return;
    if (child.ref && child.ref.current) {
      const animations = child.ref.current.getAnimations();
      const isAnimating = animations.some(
        (animation: Animation) => animation.playState === "running"
      );
      if (isAnimating) {
        const domNode = child.ref.current;
        const computedStyle = window.getComputedStyle(domNode);
        const finalBoundingBox = {
          top: parseFloat(computedStyle.top),
          left: parseFloat(computedStyle.left),
          width: parseFloat(computedStyle.width),
          height: parseFloat(computedStyle.height),
          right:
            parseFloat(computedStyle.left) + parseFloat(computedStyle.width),
          bottom:
            parseFloat(computedStyle.top) + parseFloat(computedStyle.height),
        };
        boundingBoxes[child.key] = finalBoundingBox;
      } else {
        const domNode = child.ref.current;
        const nodeBoundingBox = domNode.getBoundingClientRect();
        boundingBoxes[child.key] = nodeBoundingBox;
      }
    }
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
