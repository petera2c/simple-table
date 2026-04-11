import { Suspense } from "react";

const SearchParamsSuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div />}>{children}</Suspense>;
};

export default SearchParamsSuspenseWrapper;
