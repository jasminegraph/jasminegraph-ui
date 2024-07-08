import { configureStore } from "@reduxjs/toolkit";
// Slices
import appDataSlice from "./features/appData";
import authDataSlice from "./features/authData";

export const store = configureStore({
  reducer: {
    appData: appDataSlice,
    authData: authDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
