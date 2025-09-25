"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useFetchFileById } from "@/Server/GraphQl/Operations/FetchFolderFile";
import { useFileStore } from "@/Zustand/File_Store";
import { useFileListLogic } from '@/Server/GraphQl/Operations/Logic/File_Logic';

export default function FilePage() {
  const { handleUpdateFile } = useFileListLogic();
  const { id } = useParams();              
  const setActiveFileId = useFileStore((s) => s.setActiveFileId);
  const {
    fileId,
    editFileName,
    setEditFileName,
    editFileContent,
    setEditFileContent,
    handleSubmitUpdate,
    setFileId,
  } = useFileStore();

  const { file, loading, error } = useFetchFileById(id);

  // Set active file and initialize state once the file is loaded
  useEffect(() => {
    if (file) {
      setActiveFileId(file.id);
      setFileId(file.id);              // make sure updates know the file id
      setEditFileName(file.title);     // initialize the input value
      setEditFileContent(file.content);
    }
  }, [file, setActiveFileId, setFileId, setEditFileName, setEditFileContent]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading file</p>;
  if (!file) return <p>No file found</p>;

  return (
    <div className="p-4 bg-white">
      <input
        className="w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white"
        type="text"
        placeholder="File Title"
        value={editFileName}
        onChange={(e) => setEditFileName(e.target.value)}
        onBlur={() => handleSubmitUpdate(handleUpdateFile)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmitUpdate(handleUpdateFile);
          }
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: editFileContent }} />
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
