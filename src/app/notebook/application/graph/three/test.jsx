"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Line } from "@react-three/drei";

// ========== MAIN TREE COMPONENT ==========
export default function Tree3D({ data }) {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 50, 120], fov: 50 }}>
        {/* Galaxy Background */}
        <Stars
          radius={400}
          depth={80}
          count={20000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[50, 50, 50]} intensity={1.2} />
        <pointLight position={[-40, -20, -40]} intensity={0.8} />

        {/* Controls */}
        <OrbitControls enablePan enableZoom enableRotate />

        {/* Scene */}
        <Scene data={data} />
      </Canvas>
    </div>
  );
}

// ========== SCENE ==========
function Scene({ data }) {
  return (
    <group>
      {data.map((node, i) => (
        <FolderNode key={node.id} node={node} depth={0} index={i} />
      ))}
    </group>
  );
}

// ========== FOLDER NODE ==========
function FolderNode({ node, depth, index }) {
  const x = index * 25 - 15; // spread horizontally
  const y = -depth * 25; // spread vertically
  const pos = [x, y, 0];

  return (
    <group position={pos}>
      {/* Folder sphere */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          emissive="#4338ca"
          emissiveIntensity={1.8}
          color="#6366f1"
        />
      </mesh>

      {/* Folder name */}
      <Text
        position={[0, 4, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>

      {/* Files orbiting */}
      {node.files?.map((file, i) => (
        <FileNode key={file.id} file={file} i={i} total={node.files.length} parentPos={pos} />
      ))}

      {/* Children folders */}
      <group position={[0, -18, 0]}>
        {node.children?.map((child, childIndex) => (
          <FolderNode
            key={child.id}
            node={child}
            depth={depth + 1}
            index={childIndex}
          />
        ))}
      </group>
    </group>
  );
}

// ========== FILE NODE ==========
function FileNode({ file, i, total, parentPos }) {
  const angle = (i / total) * Math.PI * 2;
  const radius = 10;
  const fx = Math.cos(angle) * radius;
  const fz = Math.sin(angle) * radius;
  const filePos = [fx, -4, fz];

  return (
    <group position={filePos}>
      {/* File sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          emissive="#16a34a"
          emissiveIntensity={1.4}
          color="#22c55e"
        />
      </mesh>

      {/* File name */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {file.title}
      </Text>

      {/* Connection line to parent folder */}
      <Line
        points={[
          [0, 0, 0], // local file pos
          [-(fx), 4, -(fz)], // approx back toward parent center
        ]}
        color="cyan"
        lineWidth={1.5}
        dashed={false}
      />
    </group>
  );
}
