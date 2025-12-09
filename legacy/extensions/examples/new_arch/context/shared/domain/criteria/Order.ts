type OrderBy = string;
enum OrderDirection {
  NONE = "",
  ASC = "asc",
  DESC = "desc",
}

export class Order {
  constructor(readonly by: OrderBy, readonly direction: OrderDirection) {}

  static none(): Order {
    return new Order("", OrderDirection.NONE);
  }

  static asc(by: OrderBy): Order {
    return new Order(by, OrderDirection.ASC);
  }

  static desc(by: OrderBy): Order {
    return new Order(by, OrderDirection.DESC);
  }
}
