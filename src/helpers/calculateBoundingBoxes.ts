import { Children, ReactNode } from "react";

interface BoundingBox {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

const calculateBoundingBoxes = (
  children: ReactNode
): { [key: string]: BoundingBox } => {
  const boundingBoxes: { [key: string]: BoundingBox } = {};

  Children.forEach(children, (child: any, index) => {
    if (child.ref && child.ref.current) {
      const domNode = child.ref.current;
      const nodeBoundingBox = domNode.getBoundingClientRect();
      boundingBoxes[child.key] = nodeBoundingBox;
    }
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
