import * as d3 from "d3";

export function drawLinks(g, root) {
  g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr(
      "d",
      d3.linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    );
}
