import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

function FolderNode({ node, position = [0, 0, 0], depth = 0 }) {
  const boxSize = 0.6;
  const gapX = 3; // horizontal spread
  const gapY = -3; // vertical spacing between levels
  const gapZ = 1; // depth spacing for children

  const childrenCount = node.children?.length || 0;
  const filesCount = node.files?.length || 0;

  return (
    <group position={position}>
      {/* Folder cube */}
      <mesh>
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        <meshStandardMaterial color={depth === 0 ? "#FF8C00" : "#1E90FF"} />
      </mesh>

      {/* Folder label */}
      <Html position={[0, 0.5, 0]} center>
        <div style={{ color: "white", fontSize: "0.8rem", fontWeight: "bold" }}>
          {node.name}
        </div>
      </Html>

      {/* Files as spheres */}
      {node.files?.map((file, i) => (
        <group
          key={file.id}
          position={[
            (i - (filesCount - 1) / 2) * 1.2,
            -1.2,
            0,
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          <Html position={[0, 0.4, 0]} center>
            <div style={{ color: "white", fontSize: "0.6rem" }}>{file.name}</div>
          </Html>
        </group>
      ))}

      {/* Children folders symmetrically left/right */}
      {node.children?.map((child, i) => {
        const offsetX = (i - (childrenCount - 1) / 2) * gapX;
        const offsetY = gapY;
        const offsetZ = Math.abs(i - (childrenCount - 1) / 2) * gapZ; // stagger depth
        return (
          <FolderNode
            key={child.id}
            node={child}
            position={[offsetX, offsetY, offsetZ]}
            depth={depth + 1}
          />
        );
      })}
    </group>
  );
}

export default function Tree3D({ data }) {
  return (
    <Canvas
      camera={{ position: [0, 10, 25], fov: 60 }}
      style={{ width: "100vw", height: "100vh", background: "#111827" }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[20, 20, 20]} intensity={1} />
      <directionalLight position={[-20, -20, 10]} intensity={0.5} />

      {/* Controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Top-level folders */}
      {data.map((node, i) => (
        <FolderNode key={node.id} node={node} position={[i * 4, 0, 0]} />
      ))}
    </Canvas>
  );
}
