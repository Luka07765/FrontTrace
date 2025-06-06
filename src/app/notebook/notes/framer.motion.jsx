"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const projects = [
  { name: "Trace", color: "bg-pink-700", border: "border-pink-600" },
  { name: "Settings", color: "bg-indigo-700", border: "border-indigo-600" },
  { name: "Profile", color: "bg-cyan-700", border: "border-cyan-600" },
];

const additionalLinks = [
  { name: "Dashboard", icon: "📊" },
  { name: "Analytics", icon: "📈" },
  { name: "Reports", icon: "📑" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  function toggleSidebar() {
    setIsOpen(!isOpen);
    setSelectedProject(null);
  }

  return (
    <div className="min-h-screen bg-neutral-800 flex">
      <motion.nav
        layout
        animate={{ 
          width: isOpen ? "16rem" : "5rem",
          borderRadius: isOpen ? "0" : "0 1rem 1rem 0"
        }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 150,
          duration: 0.4 
        }}
        className="bg-neutral-900 flex flex-col gap-6 p-4 h-full shadow-xl shadow-neutral-950 overflow-hidden relative"
      >
        {/* Resize Handle */}
        <motion.div
          className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          drag="x"
          dragConstraints={{ left: -100, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDrag={(event, info) => {
            const newWidth = 256 + info.point.x; // Start from 16rem (256px)
            if (newWidth > 200 && newWidth < 400) {
              setIsOpen(true);
            } else if (newWidth < 100) {
              setIsOpen(false);
            }
          }}
        />
        
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <motion.div 
            layout
            className="w-10 h-10 bg-gradient-to-br from-fuchsia-600 to-pink-500 rounded flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isOpen ? "logo-open" : "logo-closed"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? "A" : ">"}
              </motion.span>
            </AnimatePresence>
          </motion.div>
          
          <motion.button 
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              className="w-6 h-6 stroke-white"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              animate={{ rotate: isOpen ? 180 : 0 }}
            >
              <path d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
            </motion.svg>
          </motion.button>
        </div>

        {/* Tabs */}
        <LayoutGroup>
          <div className="flex p-1 bg-neutral-800 rounded-lg">
            {["projects", "links"].map((tab) => (
              <motion.button
                key={tab}
                className={`relative px-3 py-1 text-sm rounded-md flex-1 ${
                  activeTab === tab ? "text-white" : "text-neutral-400"
                }`}
                onClick={() => setActiveTab(tab)}
                layout
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute inset-0 bg-neutral-700 rounded-md z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </LayoutGroup>

        {/* Project Icons with Stagger */}
        <motion.div className="flex flex-col gap-4">
          <AnimatePresence>
            {(activeTab === "projects" ? projects : additionalLinks).map(
              (item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    layout
                    onClick={() => {
                      if (activeTab === "projects") {
                        setSelectedProject((prev) =>
                          prev === item.name ? null : item.name
                        );
                      }
                    }}
                    className={`flex items-center gap-3 text-white w-full p-2 rounded-lg ${
                      selectedProject === item.name
                        ? "bg-neutral-700"
                        : "hover:bg-neutral-800"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {"color" in item ? (
                      <motion.div
                        layout
                        className={`min-w-4 w-4 h-4 ${item.color} ${item.border} border rounded-full`}
                      />
                    ) : (
                      <motion.span layout className="text-lg">
                        {item.icon}
                      </motion.span>
                    )}
                    
                    {isOpen && (
                      <motion.span
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </motion.button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* Expandable Panel */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key={selectedProject}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-neutral-800 text-white rounded-lg shadow-inner overflow-hidden"
            >
              <motion.h3 
                className="font-semibold mb-2"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                {selectedProject} Settings
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Active Status</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ delay: 0.4 }}
                    />
                  </div>
                  <motion.button
                    className="w-full py-2 bg-neutral-700 rounded-md mt-2"
                    whileHover={{ backgroundColor: "#52525b" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main content area (optional placeholder) */}
      <main className="flex-1 bg-neutral-700 p-6 text-white">
        {selectedProject ? (
          <h1 className="text-2xl font-bold">{selectedProject} Dashboard</h1>
        ) : (
          <h1 className="text-2xl font-bold">Welcome</h1>
        )}
      </main>
    </div>
  );
}
