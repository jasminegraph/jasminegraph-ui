/**
Copyright 2024 JasminGraph Team
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

import { createSlice } from "@reduxjs/toolkit";

interface IAppData {
  sideBarActiveKey: string;
}

const initialData: IAppData = {
  sideBarActiveKey: "1",
};

export const appDataSlice = createSlice({
  name: "appData",
  initialState: initialData,
  reducers: {
    set_side_bar_active_key: (state, { payload }: { payload: string }) => {
      state.sideBarActiveKey = payload;
    },
  },
});

export const {
  set_side_bar_active_key
} = appDataSlice.actions;

export default appDataSlice.reducer;
