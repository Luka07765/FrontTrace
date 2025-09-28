import Image from "next/image";
import NextIcon from "@/assets/FolderFile_Icons/next.png";

export default function ExpandButton({ expand, setExpand }) {
  return (
    <button
      onClick={() => setExpand(!expand)}
      className="h-8 w-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200"
    >
      <Image
        src={NextIcon}
        alt={"Folder Open"}
        width={35}
        height={25}
        className="filter invert"
      />
    </button>
  );
}
