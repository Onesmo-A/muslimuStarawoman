import { useEffect } from 'react';
import { useMeQuery } from '../../services/api/authApi';
import { clearAuth, getStoredUser, getToken, saveAuth } from '../auth';

export function useAuth() {
    const token = getToken();
    const storedUser = getStoredUser();
    const { data, error, isLoading } = useMeQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (data?.data) {
            saveAuth(data.data, null);
        }
    }, [data]);

    useEffect(() => {
        if (error?.status === 401) {
            clearAuth();
        }
    }, [error]);

    const user = token ? data?.data ?? storedUser : null;

    return {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
    };
}
