/**
Copyright 2025 JasminGraph Team
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

interface IQueryData {
  messagePool: any[];
}

const initialData: IQueryData = {
  messagePool: [],
};

export const queryDataSlice = createSlice({
  name: "queryData",
  initialState: initialData,
  reducers: {
    add_query_result: (state, {payload}: {payload: any}) => {
      const isIdPresent = state.messagePool.some(
        (message) => message.id === payload.id
      );

      if (!isIdPresent) {
        state.messagePool.push(payload);
      }
    },
    clear_result: (state) => {
      state.messagePool = [];
    }
  },
});

export const {
  add_query_result,
  clear_result
} = queryDataSlice.actions;

export default queryDataSlice.reducer;
