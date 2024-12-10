import React, { useEffect } from 'react';
import * as d3 from 'd3';

const D3TreeChart = () => {
  useEffect(() => {
    // Original data
    const rawData = {
      __typename: 'Folder',
      id: 458,
      title: 'kjl',
      parentFolderId: 'None',
      files: [],
      children: [
        {
          __typename: 'Folder',
          id: 471,
          title: 'asdw',
          parentFolderId: 458,
          files: [
            {
              __typename: 'File',
              id: 96,
              title: 'asdw',
              content: 'New File Content',
              folderId: 471,
            },
            {
              __typename: 'File',
              id: 97,
              title: 'asdwccc',
              content: 'Luka je car',
              folderId: 471,
            },
          ],
          children: [
            {
              __typename: 'Folder',
              id: 473,
              title: 'qwe',
              parentFolderId: 471,
              files: [
                {
                  __typename: 'File',
                  id: 98,
                  title: 'asdw',
                  content: 'New File Content',
                  folderId: 473,
                },
                {
                  __typename: 'File',
                  id: 99,
                  title: 'asdw',
                  content: 'New File Content',
                  folderId: 473,
                },
                {
                  __typename: 'File',
                  id: 100,
                  title: 'asdw',
                  content: 'New File Content',
                  folderId: 473,
                },
              ],
              children: [],
            },
          ],
        },
        {
          __typename: 'Folder',
          id: 472,
          title: 'wqwq',
          parentFolderId: 458,
          files: [
            {
              __typename: 'File',
              id: 95,
              title: 'asdw',
              content: 'New File Content',
              folderId: 472,
            },
          ],
          children: [],
        },
        {
          __typename: 'Folder',
          id: 472,
          title: 'wqwq',
          parentFolderId: 458,
          files: [
            {
              __typename: 'File',
              id: 95,
              title: 'asdw',
              content: 'New File Content',
              folderId: 472,
            },
          ],
          children: [],
        },
        {
          __typename: 'Folder',
          id: 472,
          title: 'wqwq',
          parentFolderId: 458,
          files: [
            {
              __typename: 'File',
              id: 95,
              title: 'asdw',
              content: 'New File Content',
              folderId: 472,
            },
          ],
          children: [],
        },
      ],
    };

    // Transform the data so that files are included as children nodes.
    function transformData(folder) {
      const transformedChildren = [];

      // Recursively transform child folders
      if (folder.children && folder.children.length > 0) {
        folder.children.forEach((childFolder) => {
          transformedChildren.push(transformData(childFolder));
        });
      }

      // Add files as leaf nodes
      if (folder.files && folder.files.length > 0) {
        folder.files.forEach((file) => {
          transformedChildren.push({
            title: file.title,
            children: [],
          });
        });
      }

      return {
        title: folder.title,
        children: transformedChildren,
      };
    }

    const data = transformData(rawData);

    const chart = () => {
      const width = 1000;
      const marginTop = 10;
      const marginBottom = 10;
      const marginLeft = 70;

      const root = d3.hierarchy(data);
      const dx = 50;
      let dy = 150;
      let BlockWidth = 30;
      let BlockHeight = 20;

      const tree = d3.tree().nodeSize([dx, dy]);

      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);

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

      const g = svg
        .append('g')
        .attr('transform', `translate(${marginLeft}, ${marginTop})`);

      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);

      const gLink = g
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5);

      const gNode = g
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all');

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

        const transition = svg
          .transition()
          .duration(duration)
          .attr('height', height)
          .attr('viewBox', [-marginLeft, left.x - marginTop, width, height])
          .tween(
            'resize',
            window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
          );

        const node = gNode.selectAll('g').data(nodes, (d) => d.id);

        const nodeEnter = node
          .enter()
          .append('g')
          .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .on('click', (event, d) => {
            d.children = d.children ? null : d._children;
            update(event, d);

            const scale = 3.5;
            const x = d.y + 130;
            const y = d.x + 100;

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

        nodeEnter
          .append('rect')
          .attr('x', -15)
          .attr('y', -10)
          .attr('width', BlockWidth)
          .attr('height', BlockHeight)
          .attr('fill', (d) => (d._children ? '#555' : '#999'))
          .attr('stroke-width', 2);

        nodeEnter
          .append('text')
          .attr('dy', '0.31em')
          .attr('x', (d) => (d._children ? -20 : 20))
          .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
          .text((d) => d.data.title)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('stroke', 'white')
          .attr('paint-order', 'stroke');

        node
          .merge(nodeEnter)
          .transition(transition)
          .attr('transform', (d) => `translate(${d.y},${d.x})`)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 1);

        node
          .exit()
          .transition(transition)
          .remove()
          .attr('transform', (d) => `translate(${source.y},${source.x})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0);

        const link = gLink.selectAll('path').data(links, (d) => d.target.id);

        const linkEnter = link
          .enter()
          .append('path')
          .attr('d', (d) => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
          });

        link.merge(linkEnter).transition(transition).attr('d', diagonal);

        link
          .exit()
          .transition(transition)
          .remove()
          .attr('d', (d) => {
            const o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
          });

        root.eachBefore((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      root.x0 = dy / 2;
      root.y0 = 0;

      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        // If you want to collapse nodes, do so here. Otherwise remove this condition.
        if (d.depth && d.data.title && d.data.title.length !== 7)
          d.children = null;
      });

      update(null, root);
    };

    d3.select('#chart').selectAll('*').remove();
    chart();

    return () => {
      d3.select('#chart').selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h1>D3 Tree Chart with Click-to-Zoom</h1>
      <div id="chart"></div>
    </div>
  );
};

export default D3TreeChart;
