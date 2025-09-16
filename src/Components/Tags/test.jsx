"use client"
import React, { useEffect } from 'react';
import * as d3 from 'd3';

const D3TreeChart = () => {
  useEffect(() => {
    // Define the hierarchical data for the tree chart
    const data = {
      name: 'Root',
      children: [
        {
          name: 'Child 1',
          children: [
            { name: 'Grandchild 1.1' },
            {
              name: 'Grandchild 1.2',
              children: [
        
              ],
            },
            {
              name: 'Grandchild 1.3',
              children: [
                { name: 'Great Grandchild 1.3.1' },
                {
                  name: 'Great Grandchild 1.3.2',
                  children: [
     
                         { name: 'Great Grandchild 1.3.1' },
                { name: 'Great Grandchild 1.3.2' },
                { name: 'Great Grandchild 2.1.1' },
                { name: 'Great Grandchild 2.1.2' },

  
                  ],
                },
                { name: 'Great Grandchild 2.1.1' },
                {
                  name: 'Great Grandchild 2.1.2',
                  children: [
                    { name: 'Great Grandchild 1.3.1' },
                    { name: 'Great Grandchild 1.3.2' },
                    { name: 'Great Grandchild 2.1.1' },
                    { name: 'Great Grandchild 2.1.2' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Child 2',
          children: [
            {
              name: 'Grandchild 2.1',
              children: [
                { name: 'Great Grandchild 2.1.1' },
                {
                  name: 'Great Grandchild 2.1.2',
                  children: [
                    { name: 'Great Grandchild 1.3.1' },
                    {
                      name: 'Great Grandchild 1.3.2',
                      children: [
                        { name: 'Great Grandchild 1.3.1' },
                        { name: 'Great Grandchild 1.3.2' },
                        { name: 'Great Grandchild 2.1.1' },
                        { name: 'Great Grandchild 2.1.2' },
                      ],
                    },
                    { name: 'Great Grandchild 2.1.1' },
                    {
                      name: 'Great Grandchild 2.1.2',
                      children: [
                        {
                          name: 'Great Grandchild 1.3.1',
                          children: [
                            { name: 'Great Grandchild 1.3.1' },
                            {
                              name: 'Great Grandchild 1.3.2',
                              children: [
                                { name: 'Great Grandchild 1.3.1' },
                                { name: 'Great Grandchild 1.3.2' },
                                {
                                  name: 'Great Grandchild 2.1.1',
                                  children: [
                                    { name: 'Great Grandchild 1.3.1' },
                                    { name: 'Great Grandchild 1.3.2' },
                                    { name: 'Great Grandchild 2.1.1' },
                                    { name: 'Great Grandchild 2.1.2' },
                                  ],
                                },
                                {
                                  name: 'Great Grandchild 2.1.2',
                                  children: [
                                    { name: 'Great Grandchild 1.3.1' },
                                    { name: 'Great Grandchild 1.3.2' },
                                    { name: 'Great Grandchild 2.1.1' },
                                    { name: 'Great Grandchild 2.1.2' },
                                  ],
                                },
                              ],
                            },
                            { name: 'Great Grandchild 2.1.1' },
                            { name: 'Great Grandchild 2.1.2' },
                          ],
                        },
                        { name: 'Great Grandchild 1.3.2' },
                        { name: 'Great Grandchild 2.1.1' },
                        { name: 'Great Grandchild 2.1.2' },
                      ],
                    },
                  ],
                },
                { name: 'Great Grandchild 2.1.1' },
                { name: 'Great Grandchild 2.1.2' },
                { name: 'Great Grandchild 2.1.1' },
                { name: 'Great Grandchild 2.1.2' },
              ],
            },
            { name: 'Grandchild 2.2' },
          ],
        },
        {
          name: 'Child 3',
          children: [
            {
              name: 'Grandchild 3.1',
              children: [
                { name: 'Great Grandchild 3.1.1' },
                { name: 'Great Grandchild 3.1.2' },
                {
                  name: 'Great Grandchild 3.1.3',
                  children: [
                    {
                      name: 'Grandchild 2.1',
                      children: [
                        { name: 'Great Grandchild 2.1.1' },
                        {
                          name: 'Great Grandchild 2.1.2',
                          children: [
                            {
                              name: 'Grandchild 2.1',
                              children: [
                                { name: 'Great Grandchild 2.1.1' },
                                { name: 'Great Grandchild 2.1.2' },
                              ],
                            },
                            { name: 'Grandchild 2.2' },
                          ],
                        },
                      ],
                    },
                    { name: 'Grandchild 2.2' },
                  ],
                },
              ],
            },
            { name: 'Grandchild 3.2' },
            { name: 'Grandchild 3.3' },
          ],
        },
        {
          name: 'Child 4',
          children: [
            { name: 'Grandchild 4.1' },
            { name: 'Grandchild 4.2' },
            { name: 'Grandchild 4.3' },
            { name: 'Grandchild 4.4' },
          ],
        },
      ],
    };

    const chart = () => {
   
      const width = 400;
      const marginTop = 10;
      const marginBottom = 10;
      const marginLeft = 70;

      // Create a hierarchy from the data
      const root = d3.hierarchy(data);
      const dx = 50; // Vertical spacing between nodes
      let dy = 150; // Horizontal spacing between nodes
      let BlockWidth = 30;
      let BlockHeight = 20;

      // Create a tree layout and set node size for spacing
      const tree = d3.tree().nodeSize([dx, dy]);

      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);

      // Create an SVG element for the chart
      const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', dx)
        .attr('viewBox', [-marginLeft, -marginTop, width, dx])
        .style('max-width', '100%')
        .style('height', 'auto')
        .style('font', '10px sans-serif')
        .style('user-select', 'none');

      // Add a group for the entire tree that will be zoomable
      const g = svg
        .append('g')
        .attr('transform', `translate(${marginLeft}, ${marginTop})`);

      // Define zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 5]) // Define the zoom scale range
        .on('zoom', (event) => {
          g.attr('transform', event.transform); // Apply the transform to the tree group
        });

      // Apply zoom behavior to the SVG
      svg.call(zoom);

      // Group for links between nodes
      const gLink = g
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5);

      // Group for nodes
      const gNode = g
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all');

      // Update function to handle transitions and rendering
      function update(event, source) {
        const duration = event?.altKey ? 2500 : 250; // Duration for the transition
        const nodes = root.descendants().reverse(); // Get all nodes
        const links = root.links(); // Get links between nodes

        tree(root); // Compute the new tree layout

        let left = root;
        let right = root;
        // Determine the leftmost and rightmost nodes
        root.eachBefore((node) => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        // Calculate the height of the chart
        const height = right.x - left.x + marginTop + marginBottom;

        // Transition the SVG size
        const transition = svg
          .transition()
          .duration(duration)
          .attr('height', height)
          .attr('viewBox', [-marginLeft, left.x - marginTop, width, height])
          .tween(
            'resize',
            window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
          );

        // Bind data to nodes
        const node = gNode.selectAll('g').data(nodes, (d) => d.id);

        // Enter selection for new nodes
        const nodeEnter = node
          .enter()
          .append('g')
          .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
          .attr('fill-opacity', 0) // Initially hidden
          .attr('stroke-opacity', 0)
          .on('click', (event, d) => {
            // Toggle the children on click
            d.children = d.children ? null : d._children;
            update(event, d); // Call update with the new state

            // Zoom into the clicked node
            const scale = 3.5; // Set the zoom scale factor
            const x = d.y + 130; // Use the node's y position (horizontal)
            const y = d.x + 100; // Use the node's x position (vertical)

            svg
              .transition()
              .duration(750)
              .call(
                zoom.transform,
                d3.zoomIdentity
                  .translate(width / 2, height / 2)
                  .scale(scale)
                  .translate(-x, -y)
              );
          });

        // Create rectangles for nodes
        nodeEnter
          .append('rect')
          .attr('x', -15) // Center rectangle horizontally
          .attr('y', -10) // Center rectangle vertically
          .attr('width', BlockWidth) // Size of the rectangle
          .attr('height', BlockHeight) // Height of the rectangle
          .attr('fill', (d) => (d._children ? '#555' : '#999')) // Color based on child state
          .attr('stroke-width', 2);

        // Add text labels to nodes
        nodeEnter
          .append('text')
          .attr('dy', '0.31em') // Vertical alignment
          .attr('x', (d) => (d._children ? -20 : 20)) // Adjust text x position
          .attr('text-anchor', (d) => (d._children ? 'end' : 'start')) // Align text
          .text((d) => d.data.name) // Set the text to the node name
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('stroke', 'white') // Text stroke color
          .attr('paint-order', 'stroke');

        // Merge enter and update selections for nodes
        node
          .merge(nodeEnter)
          .transition(transition)
          .attr('transform', (d) => `translate(${d.y},${d.x})`) // Move nodes to their new position
          .attr('fill-opacity', 1) // Make nodes visible
          .attr('stroke-opacity', 1);

        // Exit selection for nodes that are no longer needed
        node
          .exit()
          .transition(transition)
          .remove() // Remove the node
          .attr('transform', (d) => `translate(${source.y},${source.x})`)
          .attr('fill-opacity', 0) // Fade out
          .attr('stroke-opacity', 0);

        // Bind data to links
        const link = gLink.selectAll('path').data(links, (d) => d.target.id);

        // Enter selection for new links
        const linkEnter = link
          .enter()
          .append('path')
          .attr('d', (d) => {
            const o = { x: source.x0, y: source.y0 }; // Start at the source position
            return diagonal({ source: o, target: o }); // Use diagonal link generator
          });

        // Merge enter and update selections for links
        link.merge(linkEnter).transition(transition).attr('d', diagonal); // Update the path for links

        // Exit selection for links that are no longer needed
        link
          .exit()
          .transition(transition)
          .remove() // Remove the link
          .attr('d', (d) => {
            const o = { x: source.x, y: source.y }; // Start at the current position
            return diagonal({ source: o, target: o }); // Use diagonal link generator
          });

        // Update the previous positions of the nodes
        root.eachBefore((d) => {
          d.x0 = d.x; // Store the current x position
          d.y0 = d.y; // Store the current y position
        });
      }

      // Initialize the root node's position
      root.x0 = dy / 2;
      root.y0 = 0;

      // Assign unique IDs and collapse nodes at depth greater than 0, except those with name length of 7
      root.descendants().forEach((d, i) => {
        d.id = i; // Assign an ID based on the index
        d._children = d.children; // Store the original children
        if (d.depth && d.data.name.length !== 7) d.children = null; // Collapse nodes based on depth and name length
      });

      update(null, root); // Initial update to render the tree
    };

    d3.select('#chart').selectAll('*').remove(); // Clear the chart before rendering
    chart(); // Call the chart function to create the visualization

    return () => {
      d3.select('#chart').selectAll('*').remove(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div>
      <h1>D3 Tree Chart with Click-to-Zoom</h1>
      <div id="chart"></div> {/* Container for the D3 chart */}
    </div>
  );
};

export default D3TreeChart;