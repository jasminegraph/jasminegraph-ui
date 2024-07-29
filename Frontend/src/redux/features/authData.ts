import { IUserAccessData } from "@/types/user-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthenticationData {
  isUserAuthenticated: boolean;
  isUserDataFetched: boolean;
  userData: IUserAccessData;
}

const initialData: IAuthenticationData = {
  isUserAuthenticated: false,
  isUserDataFetched: false,
  userData: {
    _id: "",
    fullName: "",
    email: "",
    role: "",
    enabled: false,
  },
};

export const authDataSlice = createSlice({
  name: "authData",
  initialState: initialData,
  reducers: {
    set_Is_User_Authenticated: (state, action: PayloadAction<boolean>) => {
      state.isUserAuthenticated = action.payload;
    },
    set_User_Data: (state, action: PayloadAction<IUserAccessData>) => {
      state.userData = action.payload;
      state.isUserDataFetched = true;
    },
    set_Clear_User_Data: (state) => {
      state.userData = initialData.userData;
      state.isUserDataFetched = false;
    }
  },
});

export const {
  set_Is_User_Authenticated,
  set_User_Data,
  set_Clear_User_Data
} = authDataSlice.actions;

export default authDataSlice.reducer;
