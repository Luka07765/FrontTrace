'use client';
import ItemList from '../Test/ItemList';
import ItemCard from './itemCard';
import FolderList from '../Data';

export default function Dashboard() {

  return (
    <div className='overflow-auto'>
      
           <FolderList render={item => (
  <ItemCard key={item.id} item={item} />
)} />
    </div>
  );
}
