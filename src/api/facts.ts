import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Fact {
  id: number
  info: string
  source: string
}

class EventError extends Error { }
class FatalError extends Error { }

const onopen = (response: Response): Promise<void> => {
  if (response.ok && response.headers?.get('content-type') === EventStreamContentType) {
    return Promise.resolve(); // everything's good
  } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
    // client-side errors are usually non-retriable:
    throw new FatalError();
  } else {
    throw new EventError();
  }
}

const onclose = () => {
  // if the server closes the connection unexpectedly, retry:
  throw new EventError();
}

const onerror = (error: any) => {
  if (error instanceof FatalError) {
    throw error; // rethrow to stop the operation
  } else {
    // do nothing to automatically retry. You can also
    // return a specific retry interval here.
  }
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
        return factsAdapter.addMany(
          factsAdapter.getInitialState(),
          response
        )
      },
      onCacheEntryAdded: async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
        const controller = new AbortController()
        // wait for the initial query to resolve before proceeding
        await cacheDataLoaded
        // start event source
        fetchEventSource('http://localhost:5555/events', {
          onopen,
          onclose,
          onerror,
          signal: controller.signal,
          onmessage: response => {
            console.info('OnMessage::', response)
            const parsedData = JSON.parse(response.data);
            updateCachedData(facts => {
              factsAdapter.upsertMany(facts, parsedData)
            })
          },
        })
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        controller.abort()
        console.info('EventSource:: Connection Closed...')
      },
    }),
  }),
})

export const { useGetFactsQuery } = factsApi