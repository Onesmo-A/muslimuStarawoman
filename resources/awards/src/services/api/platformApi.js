import { baseApi } from './baseApi';

export const platformApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        home: builder.query({ query: () => '/public/home' }),
        categories: builder.query({ query: () => '/public/categories', providesTags: ['Categories'] }),
        events: builder.query({ query: () => '/events', providesTags: ['Events'] }),
        winnersBySeason: builder.query({
            query: (seasonId) => `/winners?award_season_id=${seasonId}`,
            providesTags: ['Winners'],
        }),
        dashboard: builder.query({ query: () => '/admin/dashboard', providesTags: ['Dashboard'] }),
        createNomination: builder.mutation({
            query: (payload) => ({ url: '/nominations', method: 'POST', body: payload }),
            invalidatesTags: ['Nominations'],
        }),
    }),
});

export const {
    useHomeQuery,
    useCategoriesQuery,
    useEventsQuery,
    useWinnersBySeasonQuery,
    useDashboardQuery,
    useCreateNominationMutation,
} = platformApi;
