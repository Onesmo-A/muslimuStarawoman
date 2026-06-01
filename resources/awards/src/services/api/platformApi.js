import { baseApi } from './baseApi';

export const platformApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        home: builder.query({ query: () => '/public/home' }),
        categories: builder.query({ query: () => '/public/categories', providesTags: ['Categories'] }),
        nominees: builder.query({ query: () => '/public/nominees', providesTags: ['Nominees'] }),
        events: builder.query({ query: () => '/events', providesTags: ['Events'] }),
        winnersBySeason: builder.query({
            query: (seasonId) => `/winners?award_season_id=${seasonId}`,
            providesTags: ['Winners'],
        }),
        dashboard: builder.query({ query: () => '/admin/dashboard', providesTags: ['Dashboard'] }),
        adminCategories: builder.query({ query: () => '/admin/categories', providesTags: ['Categories'] }),
        adminCategory: builder.query({ query: (id) => `/admin/categories/${id}`, providesTags: ['Categories'] }),
        createAdminCategory: builder.mutation({
            query: (payload) => ({ url: '/admin/categories', method: 'POST', body: payload }),
            invalidatesTags: ['Categories', 'Dashboard'],
        }),
        updateAdminCategory: builder.mutation({
            query: ({ id, ...payload }) => ({ url: `/admin/categories/${id}`, method: 'PUT', body: payload }),
            invalidatesTags: ['Categories', 'Dashboard'],
        }),
        deleteAdminCategory: builder.mutation({
            query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Categories', 'Dashboard'],
        }),
        adminNominees: builder.query({ query: () => '/admin/nominees', providesTags: ['Nominees'] }),
        adminNominee: builder.query({ query: (id) => `/admin/nominees/${id}`, providesTags: ['Nominees'] }),
        createAdminNominee: builder.mutation({
            query: (payload) => ({ url: '/admin/nominees', method: 'POST', body: payload }),
            invalidatesTags: ['Nominees', 'Dashboard'],
        }),
        updateAdminNominee: builder.mutation({
            query: ({ id, body }) => ({ url: `/admin/nominees/${id}`, method: body instanceof FormData ? 'POST' : 'PUT', body }),
            invalidatesTags: ['Nominees', 'Dashboard'],
        }),
        deleteAdminNominee: builder.mutation({
            query: (id) => ({ url: `/admin/nominees/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Nominees', 'Dashboard'],
        }),
        adminNominations: builder.query({ query: () => '/admin/nominations', providesTags: ['Nominations'] }),
        adminNomination: builder.query({ query: (id) => `/admin/nominations/${id}`, providesTags: ['Nominations'] }),
        reviewAdminNomination: builder.mutation({
            query: ({ id, ...payload }) => ({ url: `/admin/nominations/${id}/review`, method: 'POST', body: payload }),
            invalidatesTags: ['Nominations', 'Dashboard'],
        }),
        deleteAdminNomination: builder.mutation({
            query: (id) => ({ url: `/admin/nominations/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Nominations', 'Dashboard'],
        }),
        myNominations: builder.query({ query: () => '/nominations', providesTags: ['Nominations'] }),
        votingEligibility: builder.query({
            query: (categoryId) => `/voting/eligibility?award_category_id=${categoryId}`,
        }),
        castVote: builder.mutation({
            query: (payload) => ({ url: '/voting/cast', method: 'POST', body: payload }),
            invalidatesTags: ['Dashboard'],
        }),
        createNomination: builder.mutation({
            query: (payload) => ({ url: '/nominations', method: 'POST', body: payload }),
            invalidatesTags: ['Nominations'],
        }),
    }),
});

export const {
    useHomeQuery,
    useCategoriesQuery,
    useNomineesQuery,
    useEventsQuery,
    useWinnersBySeasonQuery,
    useDashboardQuery,
    useAdminCategoriesQuery,
    useAdminCategoryQuery,
    useCreateAdminCategoryMutation,
    useUpdateAdminCategoryMutation,
    useDeleteAdminCategoryMutation,
    useAdminNomineesQuery,
    useAdminNomineeQuery,
    useCreateAdminNomineeMutation,
    useUpdateAdminNomineeMutation,
    useDeleteAdminNomineeMutation,
    useAdminNominationsQuery,
    useAdminNominationQuery,
    useReviewAdminNominationMutation,
    useDeleteAdminNominationMutation,
    useMyNominationsQuery,
    useVotingEligibilityQuery,
    useCastVoteMutation,
    useCreateNominationMutation,
} = platformApi;
