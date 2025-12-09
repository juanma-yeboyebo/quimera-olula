import { FacturaSearcher } from "../application/FacturaSearcher";
import { MockedFacturaRepository } from "./mock/MockedFacturaRepository";
import { FacturaFilterMother } from "./mother/FacturaFilterMother";
import { FacturaMother } from "./mother/FacturaMother";

let repository: MockedFacturaRepository;
let searcher: FacturaSearcher;

beforeEach(() => {
  repository = new MockedFacturaRepository();
  searcher = new FacturaSearcher(repository);
});

describe("FacturaSearcher", () => {
  it("should search some existing Facturas", async () => {
    const facturas = [FacturaMother.default(), FacturaMother.default(), FacturaMother.default()];
    const filter = FacturaFilterMother.default();

    repository.returnOnSearch(facturas);

    const response = await searcher.run({ filter });

    repository.assertSearch();
    expect(facturas.length).toEqual(response.length);
  });

  it("should find no Facturas", async () => {
    const filter = FacturaFilterMother.default();

    const response = await searcher.run({ filter });

    repository.assertSearch();
    expect(response.length).toEqual(0);
  });
});
