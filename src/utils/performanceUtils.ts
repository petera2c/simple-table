import HeaderObject from "../types/HeaderObject";

export function throttle(func: (...args: any[]) => void, limit: number) {
  let lastCallTime: number | null = null; // Keeps track of the last time the function was called
  let timeoutId: ReturnType<typeof setTimeout> | null = null; // Stores the timeout ID

  return function (this: any, ...args: any[]) {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= limit) {
      // If it's the first call or enough time has passed since the last call
      func.apply(this, args); // Call the function
      lastCallTime = now; // Update the last call time
    } else if (timeoutId === null) {
      // If the function is called again before the limit, set a timeout
      timeoutId = setTimeout(() => {
        func.apply(this, args); // Call the function after the remaining time
        lastCallTime = Date.now(); // Update the last call time
        timeoutId = null; // Reset the timeout ID
      }, limit - (now - lastCallTime));
    }
  };
}

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
