export const AUTH_TOKEN_KEY = 'awards_token';
export const AUTH_USER_KEY = 'awards_user';

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUser = () => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
};

export const saveAuth = (user, token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
};

export const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

export const getLandingPath = (user) => {
    const roles = user?.roles ?? [];
    const permissions = user?.permissions ?? [];

    if (permissions.includes('manage_dashboard')) {
        return '/admin';
    }

    if (permissions.includes('manage_scores') || roles.includes('judge')) {
        return '/admin/scores';
    }

    if (permissions.includes('manage_nominations')) {
        return '/admin/nominations';
    }

    if (permissions.includes('manage_reports')) {
        return '/admin/reports';
    }

    if (roles.includes('sponsor')) {
        return '/sponsors';
    }

    return '/';
};
