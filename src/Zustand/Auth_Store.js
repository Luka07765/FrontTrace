// stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      login: (token) => {
        set({ accessToken: token, isAuthenticated: true });
        localStorage.setItem('accessToken', token);
      },
      logout: async () => {
        const token = get().accessToken;
        if (token) {
          try {
            // Attempt to logout on the server
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/Logout`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                // Uncomment if your backend requires credentials
                // withCredentials: true,
              }
            );
            console.log('Server logout successful.');
          } catch (error) {
            console.error(
              'Error during server logout:',
              error.response?.data || error.message
            );
          }
        } else {
          console.warn('No access token found. Skipping server logout.');
        }

        // Clear the store and localStorage
        set({ accessToken: null, isAuthenticated: false });
        localStorage.removeItem('accessToken');
        // Optionally clear other related data, e.g., Apollo Client cache
        // const client = get().apolloClient;
        // if (client) await client.clearStore();
      },
      validateToken: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/ValidateToken`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({ isAuthenticated: true });
          console.log('Token is valid.');
        } catch (error) {
          console.error(
            'Token validation failed:',
            error.response?.data || error.message
          );
          await get().logout();
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      // Optionally, you can define partial persistence or transformation
    }
  )
);

export default useAuthStore;
