import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../shared/auth';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers) => {
            const token = getToken();

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            headers.set('Accept', 'application/json');

            return headers;
        },
    }),
    tagTypes: ['Dashboard', 'Nominations', 'Events', 'Categories', 'Winners', 'Tickets'],
    endpoints: () => ({}),
});
