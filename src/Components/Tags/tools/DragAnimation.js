import * as d3 from 'd3';
export function addDragBehavior(nodeSelection, g) {
  function dragstarted(event, d) {
    d3.select(this).raise(); // bring node to front
  }

  function dragged(event, d) {
    d.x = event.x; // update x
    d.y = event.y; // update y
    d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
    
    // optionally update links dynamically
    g.selectAll(".link")
      .attr("x1", (l) => l.source.x)
      .attr("y1", (l) => l.source.y)
      .attr("x2", (l) => l.target.x)
      .attr("y2", (l) => l.target.y);
  }

  d3.selectAll(nodeSelection).call(
    d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
  );
}
