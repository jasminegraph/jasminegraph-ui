import { IUserAccessData } from "@/types/user-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICacheData {
  state: {
    isUsersCacheLoaded: boolean;
  };
  users: IUserAccessData[];
}

const initialData: ICacheData = {
  state: {
    isUsersCacheLoaded: false,
  },
  users: [],
};

export const cacheDataSlice = createSlice({
  name: "cacheData",
  initialState: initialData,
  reducers: {
    set_Users_Cache: (state, action: PayloadAction<IUserAccessData[]>) => {
      state.users = action.payload;
      state.state.isUsersCacheLoaded = true;
    },
    clear_Users_Cache: (state) => {
      state.users = [];
      state.state.isUsersCacheLoaded = false;
    }
  },
});

export const {
  set_Users_Cache,
  clear_Users_Cache,
} = cacheDataSlice.actions;

export default cacheDataSlice.reducer;
