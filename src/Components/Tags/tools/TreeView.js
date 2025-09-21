import * as d3 from "d3";

export function fitTreeToView(svg, g, root, width, height, zoom) {
  const xExtent = d3.extent(root.descendants(), (d) => d.x);
  const yExtent = d3.extent(root.descendants(), (d) => d.y);

  const scaleX = (width - 100) / (xExtent[1] - xExtent[0]);
  const scaleY = (height - 100) / (yExtent[1] - yExtent[0]);
  const scale = Math.min(scaleX, scaleY, 1);

  const translateX = (width - (xExtent[1] + xExtent[0]) * scale) / 2;
  const translateY = (height - (yExtent[1] + yExtent[0]) * scale) / 2;

  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(translateX, translateY).scale(scale)
  );
}
