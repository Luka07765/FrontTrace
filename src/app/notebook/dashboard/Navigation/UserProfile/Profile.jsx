import { useLogout } from '@/Server/AUTH/Logout';
function Profile() {
  const { handleLogout } = useLogout();
  return (
    <div>
      Profile{' '}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
