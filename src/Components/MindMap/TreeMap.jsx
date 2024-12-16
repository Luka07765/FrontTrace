'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ForceDirectedTree = ({ structure }) => {
  const chartRef = useRef();

  useEffect(() => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Transform function that adapts folder data to the required hierarchical format
    const transformStructure = (folder) => ({
      name: folder.title || folder.name,
      filesCount: folder.files?.length || 0,
      subfoldersCount: folder.children?.length || 0,
      children: [
        ...(folder.files || []).map((file) => ({
          name: file.title || file.name,
          filesCount: 0,
          subfoldersCount: 0,
          children: [],
        })),
        ...(folder.children || []).map((child) => transformStructure(child)),
      ],
    });

    if (!structure || structure.length === 0) return;

    // If structure is already an array of multiple roots, use all of them
    // Otherwise, if it's a single root, wrap it in an array
    const rootFolders = Array.isArray(structure) ? structure : [structure];

    // Transform each root folder into hierarchical data
    const transformedData = rootFolders.map((root) => transformStructure(root));

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    // Create a separate d3 hierarchy for each root
    const hierarchies = transformedData.map((d) => d3.hierarchy(d));

    // Collect all links and nodes from all hierarchies
    const links = hierarchies.flatMap((h) => h.links());
    const nodes = hierarchies.flatMap((h) => h.descendants());

    // Dimensions
    const width = 928;
    const height = 600;

    // Initialize simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(50)
          .strength(1)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const svg = d3
      .select(chartRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto;');

    // Links
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line');

    // Nodes
    const node = svg
      .append('g')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('fill', (d) => (d.children ? '#555' : '#000'))
      .attr('stroke', (d) => (d.children ? '#555' : '#fff'))
      .attr('r', (d) =>
        Math.max(5, 5 + d.data.filesCount * 2 + d.data.subfoldersCount * 2)
      )
      .call(drag(simulation));

    node.append('title').text((d) => d.data.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [structure]);

  return (
    <div>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default ForceDirectedTree;
