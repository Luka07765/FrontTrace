export function drawNodes(g, root) {
  const node = g
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  node
    .append("rect")
    .attr("width", 14)
    .attr("height", 14)
    .attr("x", -7)
    .attr("y", -7)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", (d) => (d.children ? "#69b3a2" : "#888"));

  node
    .append("text")
    .attr("dy", "1.5em")
    .attr("text-anchor", "middle")
    .text((d) => d.data.name)
    .style("font-size", "12px")
    .style("fill", "#333");
}
