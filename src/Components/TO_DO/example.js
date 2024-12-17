import React, { useEffect } from 'react';
import * as d3 from 'd3';

const TreeWithTwoTypes = () => {
  useEffect(() => {
    // Tree data
    const data = {
      name: 'Root',
      children: [
        {
          name: 'Branch 1',
          children: [
            { name: 'Leaf 1.1', number: 42 }, // Leaf node
            { name: 'Leaf 1.2', number: 33 }, // Leaf node
          ],
        },
        {
          name: 'Branch 2',
          children: [
            { name: 'Leaf 2.1', number: 20 }, // Leaf node
          ],
        },
      ],
    };

    // Set up dimensions
    const width = 600;
    const height = 400;

    // Create SVG
    const svg = d3
      .select('#tree-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('font', '12px sans-serif');

    // Create a hierarchy from data
    const root = d3.hierarchy(data, (d) => d.children);

    // Tree layout
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Add links
    svg
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .linkVertical()
          .x((d) => d.x + 50)
          .y((d) => d.y + 50)
      )
      .attr('stroke', '#555')
      .attr('fill', 'none');

    // Add nodes
    const nodes = svg
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x + 50}, ${d.y + 50})`);

    // Add circles
    nodes
      .append('circle')
      .attr('r', (d) => ('number' in d.data ? d.data.number / 5 : 10)) // Larger for 'number' property
      .attr('fill', (d) => ('number' in d.data ? 'green' : 'steelblue')); // Green for LeafNodes

    // Add text labels
    nodes
      .append('text')
      .attr('dy', 4)
      .attr('y', (d) => (d.children ? -20 : 20))
      .attr('text-anchor', 'middle')
      .text(
        (d) =>
          'number' in d.data
            ? `${d.data.name} (${d.data.number})` // Leaf node
            : `${d.data.name}` // Branch node
      );

    // Cleanup on unmount
    return () => {
      d3.select('#tree-container').selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h3>Tree with Leaf Nodes and Branch Nodes</h3>
      <div id="tree-container"></div>
    </div>
  );
};

export default TreeWithTwoTypes;
