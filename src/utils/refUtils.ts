type RefCallback<T> = (instance: T | null) => void;
type RefObject<T> = { current: T | null };
type Ref<T> = RefCallback<T> | RefObject<T> | undefined | null;

/**
 * Merges multiple refs into a single ref callback
 * Handles both callback refs and ref objects
 * Framework-agnostic implementation
 */
export const mergeRefs = <T = any>(
  ...refs: Array<Ref<T>>
) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as RefObject<T>).current = value;
      }
    });
  };
};
