'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SidebarTree = ({ structure }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    if (!structure || structure.length === 0) return;

    // Transform folder structure into hierarchical data
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

    const rootData = {
      name: 'Root',
      children: structure.map((folder) => transformStructure(folder)),
    };

    // SVG setup
    const svg = d3.select(svgRef.current);
    const width = 3000;
    const height = 1200;
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g');

    // Hierarchy & layout
    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().nodeSize([100, 180]); // fixed spacing
    treeLayout(root);

    // Flip Y for bottom-up orientation
    root.each((d) => {
      d.y = height - d.y;
    });

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr(
        'd',
        d3.linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('x', -7)
      .attr('y', -7)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', (d) => (d.children ? '#69b3a2' : '#888'));

    node
      .append('text')
      .attr('dy', '1.5em')
      .attr('text-anchor', 'middle')
      .text((d) => d.data.name)
      .style('font-size', '12px')
      .style('fill', '#333');

    // Zoom behavior
    const zoom = d3.zoom().scaleExtent([0.1, 5]).on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
    svg.call(zoom);

    // Compute bounding box to fit tree
    const xExtent = d3.extent(root.descendants(), (d) => d.x);
    const yExtent = d3.extent(root.descendants(), (d) => d.y);

    const scaleX = (width - 100) / (xExtent[1] - xExtent[0]);
    const scaleY = (height - 100) / (yExtent[1] - yExtent[0]);
    const scale = Math.min(scaleX, scaleY, 1);

    const translateX = (width - (xExtent[1] + xExtent[0]) * scale) / 2;
    const translateY = (height - (yExtent[1] + yExtent[0]) * scale) / 2;

    // Apply initial zoom transform to fit everything
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );

  }, [structure]);

  return <div><svg ref={svgRef}></svg></div>;
};

export default SidebarTree;
