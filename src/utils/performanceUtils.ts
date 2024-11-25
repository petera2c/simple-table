import HeaderObject from "../types/HeaderObject";

let lastCallTime = 0;

export const useThrottle = () => {
  return ({
    callback,
    callbackProps,
    limit,
  }: {
    callback: (callbackProps: any) => void;
    callbackProps: any;
    limit: number;
  }) => {
    const now = Date.now();

    if (lastCallTime === 0 || now - lastCallTime >= limit) {
      lastCallTime = now;
      callback(callbackProps);
    }
  };
};

export const logArrayDifferences = (
  original: HeaderObject[],
  updated: HeaderObject[]
) => {
  const differences = original.reduce((diff, header, index) => {
    if (header.accessor !== updated[index]?.accessor) {
      diff.push({ original: header, updated: updated[index] });
    }
    return diff;
  }, [] as { original: HeaderObject; updated: HeaderObject | undefined }[]);

  console.info("Differences between arrays:", differences);
  console.info("\n");
};
