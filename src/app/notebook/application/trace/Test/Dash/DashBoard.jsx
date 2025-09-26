'use client';
import ItemList from '../ItemList';
import ItemCard from './itemCard';


export default function Dashboard() {

  return (
    <div>
      
           <ItemList render={item => (
  <ItemCard key={item.id} item={item} />
)} />
    </div>
  );
}
