import { fetchEventSource } from '@microsoft/fetch-event-source';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Fact {
  id: number
  info: string
  source: string
}

const factsAdapter = createEntityAdapter<Fact>()
export const factsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5555/' }),
  keepUnusedDataFor: 5,
  endpoints: (build) => ({
    getFacts: build.query<EntityState<Fact>, void>({
      query: () => ({
        url: '/events/all'
      }),
      transformResponse: (response: Array<Fact>) => {
        console.log( factsAdapter.getInitialState() )
        return factsAdapter.addMany(
          factsAdapter.getInitialState() || [],
          response
        )
      },
      onCacheEntryAdded: async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
        const controller = new AbortController()
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded
          // start event source
          fetchEventSource('http://localhost:5555/events', {
            signal: controller.signal,
            onmessage: response => {
              console.info('new event >>', response.data)
              const parsedData = JSON.parse(response.data);
              updateCachedData(facts => {
                console.log(facts.entities.length)
                factsAdapter.upsertOne(facts, parsedData)
              });
            }
          });
        } catch (e) {
          console.log(e)
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        controller.abort()
        console.log('Event Source Closed...')
      },
    }),
  }),
})

export const { useGetFactsQuery } = factsApi