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

import { GRAPH_TYPES, GraphType } from "@/data/graph-data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IQueryData {
  messagePool: Record<string, any[]>;
  inDegreeDataPool: any[];
  outDegreeDataPool: any[];
}

const initialData: IQueryData = {
  messagePool: {},
  inDegreeDataPool: [],
  outDegreeDataPool: [],
};

export const queryDataSlice = createSlice({
  name: "queryData",
  initialState: initialData,
  reducers: {
    add_query_result: (state, {payload}: {payload: any}) => {
      console.log(payload)
      const key = Object.keys(payload)[0];
      const node = payload[key];
      
      if (!state.messagePool[key]) {
        state.messagePool[key] = [];
      }

      if(node){
        state.messagePool[key].push(node);
      }
    },
    add_degree_data: (state, action: PayloadAction<{data: any, type: GraphType}>) => {
      if(action.payload.type == GRAPH_TYPES.INDEGREE){
        state.inDegreeDataPool.push(action.payload.data);
      }else if(action.payload.type == GRAPH_TYPES.OUTDEGREE){
        state.outDegreeDataPool.push(action.payload.data)
      }
    },
    clear_result: (state) => {
      state.messagePool = {};
    },
    clear_degree_data: (state, action: PayloadAction<GraphType>) => {
      if(action.payload == GRAPH_TYPES.INDEGREE){
        state.inDegreeDataPool = [];
      }else if(action.payload == GRAPH_TYPES.OUTDEGREE){
        state.outDegreeDataPool = [];
      }
    },
  },
});

export const {
  add_query_result,
  clear_result,
  add_degree_data,
  clear_degree_data
} = queryDataSlice.actions;

export default queryDataSlice.reducer;
