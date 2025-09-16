'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SidebarTree = ({ structure }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!structure || structure.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Transform structure into hierarchical format
    const transformStructure = (folder) => ({
      name: folder.title || folder.name,
      children: [
        ...(folder.files || []).map((file) => ({
          name: file.title || file.name,
          children: [],
        })),
        ...(folder.children || []).map((child) => transformStructure(child)),
      ],
    });

    const data = {
      name: 'Root',
      children: structure.map((folder) => transformStructure(folder)),
    };

    const chart = () => {
      const width = 1200;
      const marginTop = 10;
      const marginBottom = 10;
      const marginLeft = 70;
      const dx = 50;
      const dy = 150;
      const BlockWidth = 30;
      const BlockHeight = 20;

      const root = d3.hierarchy(data);
      const tree = d3.tree().nodeSize([dx, dy]);
      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);

      const svg = d3
        .select(svgRef.current)
        .attr('width', width)
        .style('max-width', '100%')
        .style('height', 'auto')
        .style('font', '10px sans-serif')
        .style('user-select', 'none');

      const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`);

      // Zoom behavior
      const zoom = d3.zoom().scaleExtent([0.5, 5]).on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
      svg.call(zoom);

      const gLink = g.append('g').attr('fill', 'none').attr('stroke', '#555').attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
      const gNode = g.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');

      function update(event, source) {
        const duration = event?.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + marginTop + marginBottom;

        const transition = svg.transition().duration(duration)
          .attr('height', height)
          .attr('viewBox', [-marginLeft, left.x - marginTop, width, height]);

        const node = gNode.selectAll('g').data(nodes, (d) => d.id);

        const nodeEnter = node.enter().append('g')
          .attr('transform', (d) => `translate(${source?.y0 || 0},${source?.x0 || 0})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .on('click', (event, d) => {
            d.children = d.children ? null : d._children;
            update(event, d);

            const scale = 3.5;
            const x = d.y + 130;
            const y = d.x + 100;

            svg.transition().duration(750).call(
              zoom.transform,
              d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
            );
          });

        nodeEnter.append('rect')
          .attr('x', -15)
          .attr('y', -10)
          .attr('width', BlockWidth)
          .attr('height', BlockHeight)
          .attr('fill', (d) => (d._children ? '#555' : '#999'))
          .attr('stroke-width', 2);

        nodeEnter.append('text')
          .attr('dy', '0.31em')
          .attr('x', (d) => (d._children ? -20 : 20))
          .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
          .text((d) => d.data.name)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('stroke', 'white')
          .attr('paint-order', 'stroke');

        node.merge(nodeEnter).transition(transition).attr('transform', (d) => `translate(${d.y},${d.x})`).attr('fill-opacity', 1).attr('stroke-opacity', 1);
        node.exit().transition(transition).remove().attr('transform', (d) => `translate(${source?.y || 0},${source?.x || 0})`).attr('fill-opacity', 0).attr('stroke-opacity', 0);

        const link = gLink.selectAll('path').data(links, (d) => d.target.id);
        const linkEnter = link.enter().append('path').attr('d', (d) => {
          const o = { x: source?.x0 || 0, y: source?.y0 || 0 };
          return diagonal({ source: o, target: o });
        });

        link.merge(linkEnter).transition(transition).attr('d', diagonal);
        link.exit().transition(transition).remove().attr('d', (d) => {
          const o = { x: source?.x || 0, y: source?.y || 0 };
          return diagonal({ source: o, target: o });
        });

        root.eachBefore((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      root.x0 = dx / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
      });

      update(null, root);
    };

    chart();

    return () => d3.select(svgRef.current).selectAll('*').remove();
  }, [structure]);

  return <svg ref={svgRef}></svg>;
};

export default SidebarTree;
