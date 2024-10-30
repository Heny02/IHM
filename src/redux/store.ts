import { configureStore } from "@reduxjs/toolkit";
import utilisateurSlice from "./slices/session.api.slice";
import apiSlice from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    utilisateur: utilisateurSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  }, // Define your reducers here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
