import { SimpleTableProps } from "../types/SimpleTableProps";

/**
 * Configuration for deprecated props
 */
interface DeprecatedProp {
  /** The deprecated prop name */
  propName: keyof SimpleTableProps;
  /** The replacement prop or configuration */
  replacement: string;
  /** Optional additional message */
  message?: string;
}

/**
 * List of deprecated props with their replacements
 */
const DEPRECATED_PROPS: DeprecatedProp[] = [
  {
    propName: "columnEditorText",
    replacement: "columnEditorConfig.text",
    message:
      "Use the columnEditorConfig object instead for better organization of column editor settings.",
  },
];

/**
 * Checks for deprecated props and logs console errors with helpful migration messages
 * @param props - The SimpleTable props to check
 */
export const checkDeprecatedProps = (props: SimpleTableProps): void => {
  // Only run in development mode
  if (process.env.NODE_ENV === "production") {
    return;
  }

  DEPRECATED_PROPS.forEach(({ propName, replacement, message }) => {
    if (props[propName] !== undefined) {
      const baseMessage = `SimpleTable: The "${propName}" prop is deprecated and will be removed in a future version.`;
      const replacementMessage = `Please use "${replacement}" instead.`;
      const additionalMessage = message ? `\n${message}` : "";

      console.error(
        `${baseMessage}\n${replacementMessage}${additionalMessage}\n\nExample:\n<SimpleTable\n  columnEditorConfig={{\n    ${
          replacement.split(".")[1]
        }: ${JSON.stringify(props[propName])}\n  }}\n/>`
      );
    }
  });
};

/**
 * Export the list of deprecated props for testing or documentation purposes
 */
export const getDeprecatedPropNames = (): string[] => {
  return DEPRECATED_PROPS.map((prop) => prop.propName);
};
