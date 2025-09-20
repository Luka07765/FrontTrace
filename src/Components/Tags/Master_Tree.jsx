'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SidebarTree = ({ structure }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear any previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    if (!structure || structure.length === 0) return;

    // Transform function that adapts folder data to the required hierarchical format
    const transformStructure = (folder) => ({
      name: folder.title || folder.name,
      filesCount: folder.files?.length || 0,
      subfoldersCount: folder.children?.length || 0,
      children: [
        ...(folder.files || []).map((file) => ({
          name: file.title,
          filesCount: 0,
          subfoldersCount: 0,
          children: [],
        })),
        ...(folder.children || []).map((child) => transformStructure(child)),
      ],
    });

    // Transform the structure into the hierarchical format
    const rootData = {
      name: 'Root',
      children: structure.map((folder) => transformStructure(folder)),
    };

    // Select the SVG element
    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 3000;

    // Set the width and height of the SVG element
    svg.attr('width', width).attr('height', height);

    // Append a group element with margin
    const g = svg.append('g').attr('transform', 'translate(50,50)');

    // Create hierarchy from the data
    const root = d3.hierarchy(rootData);

    // Create tree layout
    const treeLayout = d3.tree().size([height - 100, width - 100]);
    treeLayout(root);

    // Draw links between nodes
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      );

    // Create node groups
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    // Add rectangles for each node
    node
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('x', -7)
      .attr('y', -7)
      .attr('rx', 3) // Rounded corners
      .attr('ry', 3) // Rounded corners
      .attr('fill', (d) => (d.children ? '#69b3a2' : '#888'));

    // Add text labels for each node
    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? 20 : -20))
      .attr('text-anchor', (d) => (d.children ? 'start' : 'end'))
      .text((d) => d.data.name)
      .style('font-size', '12px')
      .style('fill', '#333');
  }, [structure]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SidebarTree;
