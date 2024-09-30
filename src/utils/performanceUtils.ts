export const throttle = (func: (...args: any[]) => void, limit: number) => {
  let isFirstCall = true;
  let inThrottle = true;

  return function (this: any, ...args: any[]) {
    if (isFirstCall) {
      isFirstCall = false;
      setTimeout(() => (inThrottle = false), limit);
      return;
    }
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
