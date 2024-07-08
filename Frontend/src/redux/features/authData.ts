import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthenticationData {
  isUserAuthenticated: boolean;
}

const initialData: IAuthenticationData = {
  isUserAuthenticated: false,
};

export const authDataSlice = createSlice({
  name: "authData",
  initialState: initialData,
  reducers: {
    set_Is_User_Authenticated: (state, action: PayloadAction<boolean>) => {
      state.isUserAuthenticated = action.payload;
    },
  },
});

export const {
  set_Is_User_Authenticated
} = authDataSlice.actions;

export default authDataSlice.reducer;
