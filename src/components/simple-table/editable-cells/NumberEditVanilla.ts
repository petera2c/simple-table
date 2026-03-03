export interface NumberEditConfig {
  defaultValue: number;
  onBlur: () => void;
  onChange: (value: string) => void;
}

/**
 * Creates and manages a number input element for editing numeric values.
 * This is a vanilla JS alternative to the NumberEdit React component.
 */
export class NumberEditInput {
  private element: HTMLInputElement;
  private config: NumberEditConfig;

  constructor(config: NumberEditConfig) {
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
    this.element.defaultValue = this.config.defaultValue.toString();
    this.element.setAttribute('autofocus', 'true');
  }

  /**
   * Sets up event listeners for the input element
   */
  private setupEventListeners(): void {
    // Handle change events with number validation
    this.element.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      
      // Only allow valid number formats (digits and optional decimal point)
      if (/^\d*\.?\d*$/.test(value)) {
        this.config.onChange(value);
      } else {
        // Revert to previous valid value if invalid input
        target.value = target.value.slice(0, -1);
      }
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
  setValue(value: string | number): void {
    this.element.value = value.toString();
  }

  /**
   * Cleans up the input element and removes event listeners
   */
  destroy(): void {
    this.element.remove();
  }
}

export default NumberEditInput;
