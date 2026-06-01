import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (payload) => ({
                url: '/auth/login',
                method: 'POST',
                body: payload,
            }),
        }),
        register: builder.mutation({
            query: (payload) => ({
                url: '/auth/register',
                method: 'POST',
                body: payload,
            }),
        }),
        me: builder.query({
            query: () => '/auth/me',
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        changePassword: builder.mutation({
            query: (payload) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useMeQuery,
    useLogoutMutation,
    useChangePasswordMutation,
} = authApi;
