import { InvalidArgument } from "../error/InvalidArgument";
import { Primitives, ValueObject } from "./ValueObject";

export abstract class EnumVO<T extends Primitives> extends ValueObject<T> {
  constructor(value: T, validValues: T[]) {
    super(value);
    this.checkValueIsValid(validValues);
  }

  private checkValueIsValid(validValues: T[]) {
    if (!validValues.includes(this.value)) {
      throw new InvalidArgument(
        `${
          this.constructor.name
        }: No valid value '${this.value.toString()}'. Value must be included in ['${validValues
          .map(value => value.toString())
          .join("', '")}']`,
      );
    }
  }
}
