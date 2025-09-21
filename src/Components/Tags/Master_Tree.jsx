"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { transformStructure } from "@/Utils/Data_Structure/Transform";
import { setupSvg } from "@/Components/Tags/tools/Setup";
import { drawLinks } from "@/Components/Tags/tools/Links";
import { drawNodes } from "@/Components/Tags/tools/Nodes";
import { applyZoom } from "@/Components/Tags/tools/Zoom";
import { fitTreeToView } from "@/Components/Tags/tools/TreeView";

const SidebarTree = ({ structure }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !structure?.length) return;

    // Prepare root data
    const rootData = {
      name: "Root",
      children: structure.map((folder) => transformStructure(folder)),
    };

    // Setup SVG + groups
    const { svg, g, width, height } = setupSvg(svgRef);

    // Create hierarchy & tree layout
    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().nodeSize([100, 180]);
    treeLayout(root);

    // Flip Y for bottom-up
    root.each((d) => {
      d.y = height - d.y;
    });

    // Draw elements
    drawLinks(g, root);
    drawNodes(g, root);

    // Zoom + fit
    const zoom = applyZoom(svg, g);
    fitTreeToView(svg, g, root, width, height, zoom);
  }, [structure]);

  return <svg ref={svgRef}></svg>;
};

export default SidebarTree;
