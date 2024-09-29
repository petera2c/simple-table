import { useEffect, useRef } from "react";

const usePrevious = (value: any) => {
  const prevChildrenRef = useRef();

  useEffect(() => {
    prevChildrenRef.current = value;
  }, [value]);

  return prevChildrenRef.current;
};

export default usePrevious;

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
