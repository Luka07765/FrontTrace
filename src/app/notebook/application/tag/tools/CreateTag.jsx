"use client";

import { useState } from "react";
import { useTagLogic } from "@/Server/GraphQl/Operations/Logic/Tag_Logic";

export default function CreateTagForm() {
  const { handleCreateTag } = useTagLogic();
  const [formData, setFormData] = useState({
    title: "",
    color: "",
    iconId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateTag(formData);
    setFormData({ title: "", color: "", iconId: "" });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Create Tag</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter tag title"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-12 h-10 p-1 border rounded-lg cursor-pointer"
          />
        </div>

        {/* Icon ID */}
        {/* Icon ID */}
<div>
  <label className="block text-sm font-medium mb-1">Icon ID</label>
  <input
    type="number"   // <-- number instead of text
    name="iconId"
    value={formData.iconId}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        iconId: Number(e.target.value), // <-- cast to number
      }))
    }
    placeholder="Enter icon ID"
    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
  />
</div>


        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create Tag
        </button>
      </form>
    </div>
  );
}
