import { ReactElement } from "react";

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactElement<any>) => ReactElement<any>;
  children: ReactElement<any>;
}

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => (
  <>{condition ? wrapper(children) : <>{children}</>}</>
);

export default ConditionalWrapper;
