/**
Copyright 2024 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

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
