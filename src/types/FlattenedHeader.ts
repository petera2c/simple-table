import HeaderObject from "./HeaderObject";

export type FlattenedHeader = {
  header: HeaderObject;
  visualIndex: number;
  depth: number;
  parent: HeaderObject | null;
  indexPath: number[];
};
