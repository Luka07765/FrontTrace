import { useEffect, useState } from 'react';
import { useToken } from '@/Server/Auth/Token';

export function useAuthCheck(cancelTokenRefresh) {
  const { checkAuthentication, scheduleTokenRefresh } = useToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanup;
    let isMounted = true;

    const authenticate = async () => {
      try {
        await checkAuthentication();
        if (isMounted) {
          setLoading(false);
          cleanup = scheduleTokenRefresh();
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        if (isMounted) setLoading(false);
      }
    };

    authenticate();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
      cancelTokenRefresh();
    };
  }, [checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh]);

  return loading;
}
