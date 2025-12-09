import { render, screen } from "@testing-library/react";
import { ReactElement } from "react";

import { MockedFacturaRepository } from "../../../context/facturas/test/mock/MockedFacturaRepository";
import { FacturaMother } from "../../../context/facturas/test/mother/FacturaMother";
import { FacturaId } from "../../../context/shared/domain/FacturaId";
import { InMemoryEventBus } from "../../../context/shared/infrastructure/InMemoryEventBus";
import { FacturasContext, FacturasContextValue } from "../FacturasContext";
import { FacturasMaster } from "../master/FacturasMaster";

const customRender = (children: ReactElement, contextValue: FacturasContextValue) => {
  render(<FacturasContext.Provider value={contextValue}>{children}</FacturasContext.Provider>);
};

let context = {} as FacturasContextValue & { facturaRepository: MockedFacturaRepository };

beforeEach(() => {
  context = {
    facturaRepository: new MockedFacturaRepository(),
    eventBus: InMemoryEventBus,
  };

  context.eventBus.cleanUp();
});

describe("FacturasMaster", () => {
  it("should render", async () => {
    const codigo = "20230A010101";
    const facturas = [
      FacturaMother.default({
        idfactura: new FacturaId(1),
        codigo,
      }),
    ];

    context.facturaRepository.returnOnSearch(facturas);

    customRender(<FacturasMaster />, context);

    const firstTitle = await screen.findByText(codigo);

    expect(firstTitle).toBeInTheDocument();
  });
});
