"use client";
import { useState } from "react";
import { useIconPickerStore } from "@/Zustand/Icon";
import Image from "next/image";
import { iconsData } from "@/Utils/icons/IconData";
import { ContextClick } from "@/Zustand/Context_Store";
import { useFileListLogic } from "@/Server/Apollo/Logic/Notes/QueryWorkTable";

export const IconPickerModal = () => {
  const { open, file, setOpen } = useIconPickerStore();
  const { iconSelected, setIconSelected } = ContextClick();
  const { handleUpdateFile } = useFileListLogic();
  const [searchTerm, setSearchTerm] = useState("");

  if (!open || !file) return null;

  const handleSave = async () => {
    await handleUpdateFile({
      id: file.id,
      iconId: iconSelected ?? file.iconId,
    });
    setIconSelected(null);
    setOpen(false);
  };

  // Filter icons by name
  const filteredIcons = Object.entries(iconsData).filter(([id, { name }]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-4 rounded shadow-md w-80">
        <h3 className="text-sm mb-2">Select an Icon</h3>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search icons..."
          className="w-full mb-2 px-2 py-1 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Icons grid */}
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
       {filteredIcons.map(([id, { image, name }]) => (
  <button
    key={id}
    onClick={() => setIconSelected(Number(id))}
    className={`border rounded p-1 flex flex-col items-center text-xs ${
      iconSelected === Number(id)
        ? "border-indigo-500"
        : "border-gray-300"
    }`}
  >
    <Image src={image} alt={name} width={24} height={24} />
    <span>{name}</span>
  </button>
))}

        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-2 justify-end">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
