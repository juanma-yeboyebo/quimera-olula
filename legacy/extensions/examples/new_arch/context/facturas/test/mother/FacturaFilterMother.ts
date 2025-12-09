import { FacturaFilter } from "../../domain/FacturaFilter";

export class FacturaFilterMother {
  static default(): FacturaFilter {
    return {
      codigo: "20230A000001",
    };
  }
}
