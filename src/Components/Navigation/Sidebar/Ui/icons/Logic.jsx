"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

// 🔹 Import your icons
import icon1 from "@/assets/FolderFile_Icons/file.png";
import icon2 from "@/assets/test/icon2.png";
import icon3 from "@/assets/test/icon3.png";

// 🔹 Mock data
const mockItems = [
  { id: 1, name: "Documents", iconId: 1 },
  { id: 2, name: "Pictures", iconId: 2 },
  { id: 3, name: "Christmas Tree", iconId: 3 },
];

// 🔹 Single item with a popup icon picker
const Item = React.memo(({ item, iconMap, onChangeIcon }) => {
  const [showPicker, setShowPicker] = useState(false);
  const currentIcon = iconMap[item.iconId] || iconMap[1];

  return (
    <div className="flex flex-col gap-2 p-2 border-b relative">
      <div className="flex items-center gap-2">
        {/* Icon preview */}
        <div
          className="cursor-pointer"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <Image src={currentIcon} alt="icon" width={24} height={24} />
        </div>

        {/* Item name */}
        <span className="flex-1 font-medium">{item.name}</span>
      </div>

      {/* Icon picker popup */}
      {showPicker && (
        <div className="absolute top-10 left-10 bg-white border rounded shadow-lg p-2 flex gap-2 z-50">
          {Object.entries(iconMap).map(([id, path]) => (
            <div
              key={id}
              className={`w-10 h-10 cursor-pointer border rounded flex items-center justify-center ${
                Number(id) === item.iconId
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => {
                onChangeIcon(item.id, Number(id));
                setShowPicker(false);
              }}
            >
              <Image src={path} alt={`Icon ${id}`} width={24} height={24} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// 🔹 Main component
const IconList = () => {
  const iconMap = useMemo(
    () => ({
      1: icon1,
      2: icon2,
      3: icon3,
    }),
    []
  );

  const [items, setItems] = useState(mockItems);

  const handleChangeIcon = (itemId, newIconId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, iconId: newIconId } : item
      )
    );
  };

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg shadow p-2">
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          iconMap={iconMap}
          onChangeIcon={handleChangeIcon}
        />
      ))}
    </div>
  );
};

export default IconList;
