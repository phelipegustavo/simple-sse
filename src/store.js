import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { factsApi } from './api/facts'


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [factsApi.reducerPath]: factsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(factsApi.middleware)
})

setupListeners(store.dispatch)
