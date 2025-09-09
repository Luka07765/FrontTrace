'use client';
import { useState } from "react";
import { iconsData } from "@/utils/icons/IconData";
import { ContextClick } from '@/Zustand/Context_Store';
export default function IconPicker() {
  const { setIconSelected} = ContextClick();


  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Pick an Icon</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(iconsData).map(([id, icon]) => (
          <button
            key={id}
            onClick={() => setIconSelected(id)}
            className="p-2 rounded-xl border-2" 
          >
            <img
              src={icon.src || icon}
              alt={`icon-${id}`}
              className="w-12 h-12 object-contain"
            />
          </button>
        ))}
      </div>

      {selectedIconId && (
        <p className="mt-4 text-sm">
          Selected Icon ID: <span className="font-bold">{selectedIconId}</span>
        </p>
      )}
    </div>
  );
}
