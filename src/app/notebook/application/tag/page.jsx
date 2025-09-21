"use client";

import { useState } from "react";
import TagManager from "./tools/CreateTag";
import { useFetchTags } from "@/Server/Apollo/Query/FetchQuery/FetchTag";
import { useTagLogic } from "@/Server/Apollo/Logic/Tag/QueryTag";

export default function Tag() {
  const { handleDeleteTag, handleUpdateTag } = useTagLogic();
  const [showTagManager, setShowTagManager] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editColor, setEditColor] = useState("#000000");
  const [editIconId, setEditIconId] = useState(null);

  const { tags, loading, error, refetch } = useFetchTags();

  const togglePopup = () => setShowTagManager((prev) => !prev);

  const openEditPopup = (tag) => {
    setEditingTag(tag);
    setEditTitle(tag.title);
    setEditColor(tag.color);
    setEditIconId(tag.iconId);
  };

  const saveEdit = () => {
    handleUpdateTag({
      id: editingTag.id,
      title: editTitle.trim(),
      color: editColor,
      iconId: editIconId,
    });
    setEditingTag(null);
  };

  return (
    <div className="">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Refresh
          </button>
          <button
            onClick={togglePopup}
            className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Create Tag
          </button>
        </div>
      </div>

      {/* Tag List */}
      <div className="mt-2">
        {loading && <p className="text-gray-500">Loading tags...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {!loading && !error && tags?.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="px-3 py-1 rounded-lg shadow-sm border text-sm flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition"
              >
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete tag
                </button>
                <button onClick={() => openEditPopup(tag)}>Edit tag</button>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></span>
                <strong className="text-gray-800">#{tag.title}</strong>
                <span className="text-xs text-gray-500">{tag.iconId}</span>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-gray-500">No tags found.</p>
        )}
      </div>

      {/* Edit Popup */}
      {editingTag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition">
          <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setEditingTag(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✖
            </button>
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Tag title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border px-2 py-1 rounded"
              />

              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
              />

              <input
                type="number"
                placeholder="Icon ID"
                value={editIconId || ""}
                onChange={(e) =>
                  setEditIconId(
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                className="border px-2 py-1 rounded"
              />

              <button
                onClick={saveEdit}
                className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for Creating Tags */}
      {showTagManager && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition">
          <div className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-md">
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✖
            </button>
            <div className="mt-2">
              <TagManager onTagCreated={refetch} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
