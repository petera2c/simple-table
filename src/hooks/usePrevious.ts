import { useEffect, useRef } from "react";

const usePrevious = <T>(value: T) => {
  const prevChildrenRef = useRef<T>(value);

  useEffect(() => {
    if (JSON.stringify(prevChildrenRef.current) !== JSON.stringify(value))
      prevChildrenRef.current = value;
  }, [value]);

  return prevChildrenRef.current;
};

export default usePrevious;

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
