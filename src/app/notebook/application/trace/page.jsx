'use client';
import Dashboard from './Dash/DashBoard';
import Sidebar from './Side/Sidebar';

export default function App() {
  return (
    <div className="flex gap-10 p-4">
      <div>
        <h2>Dashboard</h2>
        <Dashboard />
      </div>

      <div>
        <h2>Sidebar</h2>
        <Sidebar />
      </div>
    </div>
  );
}
