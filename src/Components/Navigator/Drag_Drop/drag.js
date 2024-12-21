import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DragAndResizeWithSkipping = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // **Clear existing SVG content**
    svg.selectAll('*').remove();

    // Rectangle for resizing
    const rect = svg
      .append('rect')
      .attr('x', 100)
      .attr('y', 100)
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    // Resize handle
    const handle = svg
      .append('circle')
      .attr('cx', 200)
      .attr('cy', 200)
      .attr('r', 8)
      .attr('fill', 'red')
      .attr('cursor', 'nwse-resize');

    // Draggable Circle
    const circle = svg
      .append('circle')
      .attr('cx', 300)
      .attr('cy', 150)
      .attr('r', 40)
      .attr('fill', 'steelblue')
      .attr('cursor', 'move');

    // Define step size for skipping
    const step = 30; // Movement in increments of 30 pixels

    // **Drag behavior for the circle (all directions with skipping)**
    const dragCircle = d3
      .drag()
      .on('start', function () {
        d3.select(this).attr('fill', 'orange');
      })
      .on('drag', function (event) {
        const newX = Math.round(event.x / step) * step; // Snap x to nearest step
        const newY = Math.round(event.y / step) * step; // Snap y to nearest step

        d3.select(this).attr('cx', newX).attr('cy', newY);
      })
      .on('end', function () {
        d3.select(this).attr('fill', 'steelblue');
      });

    circle.call(dragCircle);

    // Drag behavior for resizing the rectangle (skipping with steps)
    const resizeRect = d3.drag().on('drag', function (event) {
      const x = parseFloat(rect.attr('x'));
      const y = parseFloat(rect.attr('y'));

      const newWidth = Math.round((event.x - x) / step) * step; // Snap width to step
      const newHeight = Math.round((event.y - y) / step) * step; // Snap height to step

      rect
        .attr('width', Math.max(20, newWidth))
        .attr('height', Math.max(20, newHeight));

      handle
        .attr('cx', x + Math.max(20, newWidth))
        .attr('cy', y + Math.max(20, newHeight));
    });

    handle.call(resizeRect);
  }, []);

  return (
    <svg
      ref={svgRef}
      width={500}
      height={500}
      style={{ border: '1px solid black' }}
    />
  );
};

export default DragAndResizeWithSkipping;
