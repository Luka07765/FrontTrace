import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ProgrammaticZoom = () => {
  const svgRef = useRef();
  const zoomRef = useRef();
  const boxSize = 100;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('rect').remove();
    const [width, height] = [
      parseInt(svg.attr('width')),
      parseInt(svg.attr('height')),
    ];

    // Define data for multiple boxes
    const boxesData = [
      { id: 1, x: 50, y: 50, color: 'steelblue' },
      { id: 2, x: 200, y: 50, color: 'green' },
      { id: 3, x: 350, y: 50, color: 'purple' },
      { id: 4, x: 500, y: 50, color: 'orange' },
    ];

    // Create a container group
    const container = svg.append('g');

    // Create boxes
    container
      .selectAll('rect')
      .data(boxesData)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', boxSize)
      .attr('height', boxSize)
      .attr('fill', (d) => d.color);

    // Define zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    // Store zoom behavior in ref for access in button handlers
    zoomRef.current = zoom;

    svg.call(zoom);
  }, []);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 1.5);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 1 / 1.5);
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div>
      <h1>Programmatic Zoom with Buttons</h1>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <button onClick={handleResetZoom}>Reset Zoom</button>
      <svg
        ref={svgRef}
        width="800"
        height="400"
        style={{ border: '1px solid black', marginTop: '10px' }}
      ></svg>
    </div>
  );
};

export default ProgrammaticZoom;
