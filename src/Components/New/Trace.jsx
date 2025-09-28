// DashboardView.jsx
import Folder_Data from '@/Components/New/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';

export default function Trace() {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="w-60 overflow-y-auto overflow-x-hidden h-full bg-gray-900 text-white items-left pb-40 ">
        <Folder_Data render={folder => (
          <li className="list-none" key={folder.id}>
            <Folder folder={folder} />
          </li>
        )}/>
      </div>
    </div>
  );
}
