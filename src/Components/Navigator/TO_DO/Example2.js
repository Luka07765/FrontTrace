import React, { useEffect } from 'react';
import * as d3 from 'd3';

const SimpleTreeChart = () => {
  useEffect(() => {
    const data = {
      name: 'Root',
      age: 50,
      type: 'root',
      children: [
        {
          name: 'Child 1',
          age: 30,
          type: 'branch',
          children: [
            { name: 'Grandchild 1.1', age: 10, type: 'leaf' },
            { name: 'Grandchild 1.2', age: 12, type: 'leaf' },
          ],
        },
        {
          name: 'Child 2',
          age: 28,
          type: 'branch',
          children: [{ name: 'Grandchild 2.1', age: 8, type: 'leaf' }],
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
    const root = d3.hierarchy(data);

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

    // Add circles with dynamic size and color
    nodes
      .append('circle')
      .attr('r', (d) => d.data.age / 5) // Circle size based on age
      .attr('fill', (d) => {
        if (d.data.type === 'root') return 'red';
        if (d.data.type === 'branch') return 'orange';
        return 'green'; // leaf
      });

    // Add text labels
    nodes
      .append('text')
      .attr('dy', 4)
      .attr('y', (d) => (d.children ? -20 : 20))
      .attr('text-anchor', 'middle')
      .text((d) => `${d.data.name} (${d.data.age})`); // Name with age

    return () => {
      d3.select('#tree-container').selectAll('*').remove(); // Cleanup
    };
  }, []);

  return (
    <div>
      <h3>Simple D3 Tree Chart with Additional Properties</h3>
      <div id="tree-container"></div>
    </div>
  );
};

export default SimpleTreeChart;
