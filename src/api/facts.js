import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const factsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5555/' }),
  endpoints: (build) => ({
    getFacts: build.query({
      query: () => '/events/all',
      onCacheEntryAdded: async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
        // create a event source when the cache subscription starts
        const events = new EventSource('http://localhost:5555/events');
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded
          events.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
    
            updateCachedData((facts) => facts.concat(parsedData));
          };
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        events.close()
      },
    }),
  }),
})

export const { useGetFactsQuery } = factsApi