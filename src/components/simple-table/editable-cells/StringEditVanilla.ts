export interface StringEditConfig {
  defaultValue: string | null | undefined;
  onBlur: () => void;
  onChange: (value: string) => void;
}

/**
 * Creates and manages a text input element for editing string values.
 * This is a vanilla JS alternative to the StringEdit React component.
 */
export class StringEditInput {
  private element: HTMLInputElement;
  private config: StringEditConfig;

  constructor(config: StringEditConfig) {
    this.config = config;
    this.element = document.createElement('input');
    this.setupElement();
    this.setupEventListeners();
  }

  /**
   * Sets up the input element with initial properties
   */
  private setupElement(): void {
    this.element.className = 'editable-cell-input';
    this.element.type = 'text';
    this.element.defaultValue = this.config.defaultValue ?? '';
    this.element.setAttribute('autofocus', 'true');
  }

  /**
   * Sets up event listeners for the input element
   */
  private setupEventListeners(): void {
    // Handle change events
    this.element.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.config.onChange(target.value);
    });

    // Handle blur events
    this.element.addEventListener('blur', () => {
      this.config.onBlur();
    });

    // Handle keydown events
    this.element.addEventListener('keydown', (e: KeyboardEvent) => {
      // Stop propagation to prevent table navigation
      e.stopPropagation();

      // Close on Enter or Escape
      if (e.key === 'Enter' || e.key === 'Escape') {
        this.config.onBlur();
      }
    });

    // Handle mousedown events
    this.element.addEventListener('mousedown', (e: MouseEvent) => {
      // Stop propagation to prevent cell deselection
      e.stopPropagation();
    });
  }

  /**
   * Gets the input element
   * @returns The HTMLInputElement
   */
  getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Focuses the input element
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Gets the current value of the input
   * @returns The current input value
   */
  getValue(): string {
    return this.element.value;
  }

  /**
   * Sets the value of the input
   * @param value - New value to set
   */
  setValue(value: string): void {
    this.element.value = value;
  }

  /**
   * Cleans up the input element and removes event listeners
   */
  destroy(): void {
    this.element.remove();
  }
}

export default StringEditInput;
