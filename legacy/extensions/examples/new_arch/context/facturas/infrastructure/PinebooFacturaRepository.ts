import { Criteria } from "../../shared/domain/criteria/Criteria";
import { FacturaId } from "../../shared/domain/FacturaId";
import { PinebooClient } from "../../shared/infrastructure/PinebooClient";
import { Factura } from "../domain/Factura";
import { FacturaRepository } from "../domain/FacturaRepository";
import { LineaFactura } from "../domain/LineaFactura";
import { LineaFacturaId } from "../domain/LineaFacturaId";

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const BASE_URL = `${import.meta.env.VITE_API_URL}`;
const URLS = {
  find: "$base/facturascli/$idfactura?$params",
  search: "$base/facturascli?$params",
  save: "$base/facturascli/$idfactura",
  searchLineas: "$base/facturascli/$idfactura/get_lineas?$params",
  saveLineas: "$base/facturascli/$idfactura/set_lineas",
};

export class PinebooFacturaRepository implements FacturaRepository {
  async find(idfactura: FacturaId): Promise<Factura | null> {
    const client = PinebooClient.getClient();

    const paramsFacturas = this.generateFacturaParams();
    const url = URLS.find
      .replace("$base", BASE_URL)
      .replace("$idfactura", idfactura.toString())
      .replace("$params", paramsFacturas);

    const facturaDto = await client.getOne(url);
    if (!facturaDto) {
      return null;
    }

    const paramsLineas = this.generateLineaParams();
    const urlLineas = URLS.searchLineas
      .replace("$base", BASE_URL)
      .replace("$idfactura", idfactura.toString())
      .replace("$params", paramsLineas);

    const lineasDtos = await client.getMany(urlLineas);

    return this.facturaFromDto(facturaDto, lineasDtos);
  }

  async search(criteria: Criteria): Promise<Factura[]> {
    const client = PinebooClient.getClient();

    const paramsFacturas = this.generateFacturaParams({ criteria });
    const url = URLS.search.replace("$base", BASE_URL).replace("$params", paramsFacturas);

    const facturasDtos = await client.getMany(url);

    return facturasDtos.map(facturaDto => this.facturaFromDto(facturaDto, []));

    // return Promise.all(
    //   facturasDtos.map(async facturaDto => {
    //     const urlLineas = this.generateUrlLineas({ idfactura: facturaDto.idfactura });
    //     const lineasDtos = await client.getMany(urlLineas);

    //     return this.facturaFromDto(facturaDto, lineasDtos);
    //   }),
    // );
  }

  async save(factura: Factura): Promise<void> {
    const client = PinebooClient.getClient();

    const { lineas, ...cabecera } = factura;

    const url = URLS.save
      .replace("$base", BASE_URL)
      .replace("$idfactura", cabecera.idfactura.toString());

    await client.updateOne(url, cabecera);

    if (!lineas.length) {
      return;
    }

    const urlLineas = URLS.saveLineas
      .replace("$base", BASE_URL)
      .replace("$idfactura", cabecera.idfactura.toString());

    await client.updateMany(urlLineas, lineas);
  }

  private facturaFromDto(facturaDto, lineasDtos): Factura {
    return {
      idfactura: new FacturaId(facturaDto.idfactura),
      codigo: facturaDto.codigo,
      cliente: facturaDto.codcliente,
      total: facturaDto.total,
      lineas: lineasDtos.map(lineaDto => this.lineaFromDto(lineaDto)),
    };
  }

  private lineaFromDto(lineaDto): LineaFactura {
    return {
      idlinea: new LineaFacturaId(lineaDto.idlinea),
      referencia: lineaDto.referencia,
      descripcion: lineaDto.descripcion,
      cantidad: lineaDto.cantidad,
      pvp: lineaDto.pvpunitario,
      total: lineaDto.pvptotal,
    };
  }

  private generateFacturaParams({ criteria }: { criteria?: Criteria } = {}) {
    const params = new URLSearchParams({
      fields: "idfactura,codigo,codcliente,total",
    });

    if (criteria?.hasFilters()) {
      const filtered = criteria.filters.map(
        filter => `["${filter.field}", "${filter.operator}", "${filter.value}"]`,
      );
      params.set("filter", filtered.toString());
    }

    return params.toString();
  }

  private generateLineaParams() {
    const params = new URLSearchParams({
      fields: "idlinea,referencia,descripcion,cantidad,pvpunitario,pvptotal",
    });

    return params.toString();
  }
}
