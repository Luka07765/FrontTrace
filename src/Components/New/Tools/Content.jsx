import {useState} from "react"

export default function FileList() {
  const [editFileName, setEditFileName] = useState(""); // assuming state is missing

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-10">
        <input
          className="w-full pb-[10px] px-4 py-2 text-white text-[35px] font-bold bg-[#12131c] border-b-[1px] border-white text-center focus:outline-none focus:border-white"
          type="text"
          placeholder="File Title"
          value={editFileName}
          onChange={(e) => setEditFileName(e.target.value)}
        />

        <div className="bg-[#12131c] rounded-lg border border-gray-700">
          <h1>ha sam car</h1>
        </div>
      </div>
    </div>
  );
}
