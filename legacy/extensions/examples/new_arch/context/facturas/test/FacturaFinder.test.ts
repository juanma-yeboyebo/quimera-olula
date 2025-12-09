import { FacturaFinder } from "../application/FacturaFinder";
import { FacturaNotFound } from "../domain/error/FacturaNotFound";
import { MockedFacturaRepository } from "./mock/MockedFacturaRepository";
import { FacturaIdMother } from "./mother/FacturaIdMother";
import { FacturaMother } from "./mother/FacturaMother";

let repository: MockedFacturaRepository;
let finder: FacturaFinder;

beforeEach(() => {
  repository = new MockedFacturaRepository();
  finder = new FacturaFinder(repository);
});

describe("FacturaFinder", () => {
  it("should find an existing Factura", async () => {
    const factura = FacturaMother.default();

    repository.returnOnFind(factura);

    const response = await finder.run({ facturaId: factura.idfactura });

    repository.assertFind();
    expect(factura.codigo).toEqual(response.codigo);
  });

  it("should throw FacturaNotFound trying to find a non existing Factura", async () => {
    const facturaId = FacturaIdMother.default();

    await expect(finder.run({ facturaId })).rejects.toThrow(FacturaNotFound);
  });
});
