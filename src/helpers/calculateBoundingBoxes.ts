import { MutableRefObject, RefObject } from "react";
import BoundingBox from "../types/BoundingBox";
import HeaderObject from "../types/HeaderObject";
import { TEST_KEY } from "../components/Animate";
import { getCellId } from "../utils/cellUtils";

const calculateBoundingBoxes = ({
  currentHeaders,
  draggedHeaderRef,
  rowIndex,
}: {
  currentHeaders: HeaderObject[];
  draggedHeaderRef?: MutableRefObject<HeaderObject | null>;
  rowIndex: number;
}) => {
  const boundingBoxes: { [key: string]: BoundingBox | false } = {};

  currentHeaders.forEach((header: HeaderObject) => {
    if (!header) return;
    const domNode = document.getElementById(
      getCellId({ accessor: header.accessor, rowIndex })
    );
    if (domNode) {
      const animations = domNode.getAnimations();
      const isAnimating = animations.some(
        (animation: Animation) => animation.playState === "running"
      );

      const nodeBoundingBox = domNode.getBoundingClientRect();

      if (
        isAnimating &&
        draggedHeaderRef?.current?.accessor !== header.accessor
      ) {
        boundingBoxes[header.accessor] = false;
      } else {
        // if (rowIndex === 0 && header.accessor === TEST_KEY) {
        //   console.log(domNode);
        //   console.log(nodeBoundingBox.x);
        // }
        boundingBoxes[header.accessor] = nodeBoundingBox;
      }
    }
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
