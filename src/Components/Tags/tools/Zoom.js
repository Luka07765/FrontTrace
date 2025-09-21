import * as d3 from "d3";

export function applyZoom(svg, g) {
  const zoom = d3.zoom().scaleExtent([0.1, 5]).on("zoom", (event) => {
    g.attr("transform", event.transform);
  });
  svg.call(zoom);
  return zoom;
}
