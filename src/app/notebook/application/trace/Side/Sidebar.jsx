'use client';
import SidebarItem from './SidebarItem';
import ItemList from '../ItemList';

export default function Sidebar() {
  return (
    <div>
      <ItemList render={item => (
  <SidebarItem key={item.id} item={item} />
)} />
    </div>
  );
}
