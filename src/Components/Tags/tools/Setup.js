import * as d3 from "d3";

export function setupSvg(svgRef, width = 3000, height = 1200) {
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove(); // clear previous
  svg.attr("width", width).attr("height", height);

  const g = svg.append("g");
  return { svg, g, width, height };
}
