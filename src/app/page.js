'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/home/auth/login'); // Navigate to the login page
  };

  const handleRegister = () => {
    router.push('/home/auth/signup'); // Navigate to the login page
  };

  return (
    <div className="flex justify-center items-center h-screen space-x-4">
      <button
        onClick={handleLoginClick}
        className="px-14 py-7 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Log in
      </button>
      <button
        onClick={handleRegister}
        className="px-14 py-7 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Register
      </button>
    </div>
  );
}
