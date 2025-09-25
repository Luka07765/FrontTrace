"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useFetchFileById } from "@/Server/Apollo/Query/FetchQuery/FetchFolderFile";
import { useFileStore } from "@/Zustand/File_Store";

export default function FilePage() {
  const { id } = useParams();              // get file ID from URL
  const setActiveFileId = useFileStore((s) => s.setActiveFileId);
  
  // update Zustand so sidebar highlights the active file
  if (id) setActiveFileId(id);
  useEffect(() => {
    if (id) setActiveFileId(id);
  }, [id, setActiveFileId]);

  const { file, loading, error } = useFetchFileById(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading file</p>;
  if (!file) return <p>No file found</p>;

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">{file.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: file.content }} />
      {file.tags && file.tags.length > 0 && (
        <div className="mt-4 flex gap-2">
          {file.tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: tag.color || "#444" }}
            >
              {tag.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
