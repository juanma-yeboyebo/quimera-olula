import { FacturaId } from "../../../shared/domain/FacturaId";

export class FacturaIdMother {
  static default(value = 1): FacturaId {
    return new FacturaId(value);
  }
}
