import { configureStore } from "@reduxjs/toolkit";
// Slices
import appDataSlice from "./features/appData";

export const store = configureStore({
  reducer: {
    appData: appDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
