type CellValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | string[]
  | number[]
  | Record<string, unknown>[];

export default CellValue;
