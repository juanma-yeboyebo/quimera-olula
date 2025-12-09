import { Cliente } from "@quimera-extension/base-ventas";
import { Box, Filter, FilterBox } from "@quimera/comps";
import d3 from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue } from "quimera";
import React, { useEffect } from "react";

const marks = [
  { value: 0, label: "0" },
  { value: 0.5, label: "0.5" },
  { value: 1, label: "1" },
  { value: 1.5, label: "1.5" },
];

const drag = simulation => {
  function dragstarted(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
};

// const width = '100%'
const height = 800;

function BiRecomendaciones() {
  const [{ data }, dispatch] = useStateValue();

  const svgRef = React.useRef(null);

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, []);

  useEffect(() => {
    if (!data?.RecomendacionesTree) {
      return;
    }

    const root = d3.hierarchy(data?.RecomendacionesTree);
    const links = root.links();
    const nodes = root.descendants();
    const colors = d3.schemeTableau10;

    const subgroups = ["root"];

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .distance(0)
          .strength(1),
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    d3.selectAll("#tree-chart > *").remove();

    const svg = d3.select(svgRef.current).attr("viewBox", [-750 / 2, -height / 2, 750, height]);

    const linksG = svg.append("g");

    const nodesG = svg.append("g");

    let transform;

    const link = linksG
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = nodesG
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", node => {
        if (node.data.name === root.data.name) {
          return colors[0];
        }
        if (node.children) {
          return null;
        }

        const subgroup = node.data.subgroup;
        if (!subgroups.includes(subgroup)) {
          subgroups.push(subgroup);
        }

        return colors[subgroups.indexOf(subgroup) % 10];
      })
      .attr("stroke", d => (d.children ? null : "#fff"))
      .attr("stroke-width", node => {
        if (node.data.name === root.data.name) {
          return 1.5;
        }

        return node.data.value ? Math.max(1.5 * node.data.value, 0.75) : 1.5;
      })
      .attr("r", node => {
        if (node.data.name === root.data.name) {
          return 7.5;
        }

        return node.data.value ? Math.max(5 * node.data.value, 1) : 3.5;
      })
      .call(drag(simulation))
      .on("click", (event, node) => console.log({ event, node }));

    node.append("title").text(d => d.data.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    const zoom = d3.zoom().on("zoom", e => {
      linksG.attr("transform", (transform = e.transform));
      nodesG.attr("transform", (transform = e.transform));
    });

    svg.call(zoom);
  }, [data]);

  return (
    <Quimera.Template id="BiRecomendaciones">
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
        <svg id="tree-chart" ref={svgRef} height={height} style={{ flexGrow: 1 }} />
        <FilterBox
          id="filter"
          schema={getSchemas().filtroGraficoRecomendaciones}
          open={true}
          auto={true}
          minWidth="300px"
        >
          <strong>Score mínimo</strong>
          <Filter.Slider
            label="Score mínimo"
            id="scoreTreshold"
            step={0.1}
            min={0}
            max={1.5}
            operator="gte"
            marks={marks}
          />
          <Filter.List id="clientes" label="Clientes" SearchComp={Cliente} />
        </FilterBox>
      </Box>
    </Quimera.Template>
  );
}

export default BiRecomendaciones;
