export function drawNodes(g, root) {
  const node = g
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // Folder nodes (rectangles)
  node
    .filter((d) => d.children) // folders
    .append("rect")
    .attr("width", 130)   // a bit bigger than before
    .attr("height", 130)
    .attr("x", -65)
    .attr("y", -65)
    .attr("rx", 12)
    .attr("ry", 12)
    .attr("fill", "#69b3a2");

  // File nodes (circles)
  node
    .filter((d) => !d.children) // files
    .append("circle")
    .attr("r", 40) // smaller than folder
    .attr("fill", "#888");

  // Labels
  node
    .append("text")
    .attr("dy", "1.5em")
    .attr("text-anchor", "middle")
    .text((d) => d.data.name)
    .style("font-size", "12px")
    .style("fill", "#333");
}
