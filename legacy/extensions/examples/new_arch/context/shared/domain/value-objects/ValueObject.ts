import { InvalidArgument } from "../error/InvalidArgument";

export type Primitives = string | number | boolean | Date;

export abstract class ValueObject<T extends Primitives> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;

    this.checkValueIsDefined();
  }

  equals(other: ValueObject<T>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  private checkValueIsDefined() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.value === undefined || this.value === null) {
      throw new InvalidArgument(`${this.constructor.name}: value must be defined`);
    }
  }
}
