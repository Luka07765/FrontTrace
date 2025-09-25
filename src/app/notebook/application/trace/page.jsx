'use client';

// Server and Authentication
import { useToken } from '@/Server/AUTH/Token';
import { useAuthCheck } from '@/Server/AUTH/Auth-Check';



export default function Dashboard() {

  const { cancelTokenRefresh } = useToken();
  const loadingAuth = useAuthCheck(cancelTokenRefresh);



const data = [
  { id: '1', title: 'First Item', content: 'This is the first item content.' },
  { id: '2', title: 'Second Item', content: 'This is the second item content.' },
  { id: '3', title: 'Third Item', content: 'This is the third item content.' },
];



  // Loading States
  if (loadingAuth) return <p>Loading...</p>;
  

  return (
        <div>
      {data.map(item => (
        <div key={item.id} className="border p-2 mb-2 rounded bg-white">
          <h3 className="font-bold">{item.title}</h3>
          <p>{item.content}</p>
          <small>ID: {item.id}</small>
        </div>
      ))}
    </div>
  );
}