import { configureStore } from "@reduxjs/toolkit";
// Slices
import appDataSlice from "./features/appData";
import authDataSlice from "./features/authData";
import clusterDataSlice from "./features/clusterData";
import cacheDataSlice from "./features/cacheSlice";

export const store = configureStore({
  reducer: {
    appData: appDataSlice,
    authData: authDataSlice,
    clusterData: clusterDataSlice,
    cacheData: cacheDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
