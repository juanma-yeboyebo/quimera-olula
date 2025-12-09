export interface ComponentProperty {
  type: string;
  default?: string;
  required?: boolean;
}

export type ComponentSummary<T> = Record<keyof T, ComponentProperty>;
