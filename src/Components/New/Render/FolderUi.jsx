// app/components/Sidebar.jsx
"use client";
import { useState } from "react";

const items = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "👤", label: "Profile" },
  { icon: "⚙️", label: "Settings" },
  { icon: "🚪", label: "Logout" },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="fixed top-0 left-0 h-screen w-20 bg-gray-900 flex flex-col items-center py-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          className="relative w-full flex items-center justify-center py-4 cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <span className="text-2xl">{item.icon}</span>

          {hovered === idx && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg whitespace-nowrap z-50">
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
