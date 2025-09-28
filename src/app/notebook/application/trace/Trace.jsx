// DashboardView.jsx
import Folder_Data from '@/app/notebook/application/trace/Data/Folder_Data';
import Folder from '@/app/notebook/application/trace/Render/Folder_Render';

export default function DashboardView() {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="overflow-y-auto overflow-x-hidden h-full bg-gray-900 text-white items-left py-4">
        <Folder_Data render={folder => (
          <li className="list-none" key={folder.id}>
            <Folder folder={folder} />
          </li>
        )}/>
      </div>
    </div>
  );
}
