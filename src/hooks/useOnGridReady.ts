import { useEffect } from "react";

const useOnGridReady = ({ onGridReady }: { onGridReady?: () => void }) => {
  useEffect(() => {
    onGridReady?.();
  }, [onGridReady]);
};

export default useOnGridReady;
