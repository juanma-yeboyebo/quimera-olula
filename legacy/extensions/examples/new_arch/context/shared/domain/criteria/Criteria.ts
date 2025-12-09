import { Filter } from "./Filter";
import { Order } from "./Order";

interface CriteriaProps {
  filters: Filter[];
  order: Order;
  limit?: number;
  offset?: number;
}

export class Criteria {
  readonly filters: Filter[];
  readonly order: Order;
  readonly limit?: number;
  readonly offset?: number;

  constructor({ filters, order, limit, offset }: CriteriaProps) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.offset = offset;
  }

  hasFilters(): boolean {
    return this.filters.length > 0;
  }
}
