import { useEffect } from 'react';
import { useMeQuery } from '../../services/api/authApi';
import { getStoredUser, saveAuth } from '../auth';

export function useAuth() {
    const storedUser = getStoredUser();
    const { data, isLoading } = useMeQuery(undefined, { skip: !storedUser });

    useEffect(() => {
        if (data?.data) {
            saveAuth(data.data, null);
        }
    }, [data]);

    const user = data?.data ?? storedUser;

    return {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
    };
}
