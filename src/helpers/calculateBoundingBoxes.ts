import { Children, MutableRefObject } from "react";
import BoundingBox from "../types/BoundingBox";
import HeaderObject from "../types/HeaderObject";

const calculateBoundingBoxes = ({
  children,
  draggedHeaderRef,
}: {
  children: any;
  draggedHeaderRef?: MutableRefObject<HeaderObject | null>;
}) => {
  const boundingBoxes: { [key: string]: BoundingBox | false } = {};

  Children.forEach(children, (child: any) => {
    if (!child) return;
    if (child.ref && child.ref.current) {
      const animations = child.ref.current.getAnimations();
      const isAnimating = animations.some(
        (animation: Animation) => animation.playState === "running"
      );

      const domNode = child.ref.current;
      const nodeBoundingBox = domNode.getBoundingClientRect();

      if (isAnimating && draggedHeaderRef?.current?.accessor !== child.key) {
        boundingBoxes[child.key] = false;
      } else {
        boundingBoxes[child.key] = nodeBoundingBox;
      }
    }
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
