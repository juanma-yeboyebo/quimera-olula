type FilterField = string;
type FilterOperator = string;
type FilterValue = string | number;

export class Filter {
  constructor(
    readonly field: FilterField,
    readonly operator: FilterOperator,
    readonly value: FilterValue,
  ) {}
}
