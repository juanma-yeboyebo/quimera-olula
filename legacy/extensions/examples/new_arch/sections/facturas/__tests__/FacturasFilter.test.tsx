import { fireEvent, render, screen } from "@testing-library/react";
import { ReactElement } from "react";

import { FacturaFilter } from "../../../context/facturas/domain/FacturaFilter";
import { MockedFacturaRepository } from "../../../context/facturas/test/mock/MockedFacturaRepository";
import { InMemoryEventBus } from "../../../context/shared/infrastructure/InMemoryEventBus";
import { FacturasContext, FacturasContextValue } from "../FacturasContext";
import { FacturasFilter } from "../filter/FacturasFilter";

const customRender = (children: ReactElement, contextValue: FacturasContextValue) => {
  render(<FacturasContext.Provider value={contextValue}>{children}</FacturasContext.Provider>);
};

let contextValue = {} as FacturasContextValue & { facturaRepository: MockedFacturaRepository };

beforeEach(() => {
  contextValue = {
    facturaRepository: new MockedFacturaRepository(),
    eventBus: InMemoryEventBus,
  };

  contextValue.eventBus.cleanUp();
});

describe("FacturasFilter", () => {
  it("should render", async () => {
    customRender(<FacturasFilter />, contextValue);

    const codigoFilter = await screen.findByLabelText(/Código/i);

    expect(codigoFilter).toBeInTheDocument();
  });

  it("should call event with filter data", async () => {
    customRender(<FacturasFilter />, contextValue);

    const expected = {
      codigo: "20200A",
    };

    let received: FacturaFilter = {
      codigo: "",
    };

    const unsubscribe = contextValue.eventBus.subscribe("facturasFilterChanged", event => {
      received = event.filter;
    });

    const codigoFilter = await screen.findByLabelText(/Código/i);
    fireEvent.change(codigoFilter, { target: { value: expected.codigo } });

    const submitButton = await screen.findByRole("button");
    fireEvent.click(submitButton);

    unsubscribe();

    expect(received.codigo).toBe(expected.codigo);
  });
});
