"use client"
import { useState } from "react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Toggle Button */}
      <button
        className="fixed top-5 left-5 z-50 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <p>Sliding in and out smoothly with Tailwind!</p>
      </div>

      {/* Main Content */}
      <div
        className={`h-full transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        } p-6`}
      >
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
        <p>Click the button to toggle the sidebar.</p>
      </div>
    </div>
  );
}
