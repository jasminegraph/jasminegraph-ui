/**
Copyright 2025 JasmineGraph Team
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
interface  IUpBytesResponse{
    type:string;
    updates :any[];
    timestamp: string;
}

interface IQueryData {
  messagePool: Record<string, any[]>;
  visualizeData: {
    node: any[];
    edge: any[];
  }
  inDegreeDataPool: any[];
  outDegreeDataPool: any[];
  uploadBytes:IUpBytesResponse;
}

const initialData: IQueryData = {
  messagePool: {},
  visualizeData: {
    node: [],
    edge: [],
  },
  inDegreeDataPool: [],
  outDegreeDataPool: [],
    uploadBytes: {
        type: "",
        updates: [],
        timestamp: ""
    }

};

export const queryDataSlice = createSlice({
  name: "queryData",
  initialState: initialData,
  reducers: {
    add_query_result: (state, {payload}: {payload: any}) => {
      const key = Object.keys(payload)[0];
      const node = payload[key];
      
      if (!state.messagePool[key]) {
        state.messagePool[key] = [];
      }

      if(node){
        state.messagePool[key].push(node);
      }
    },
      add_semantic_result: (state, {payload}: {payload: any}) => {
          const keys = Object.keys(payload);
          keys.forEach((key) => {
              const row = payload[key];

              if (!state.messagePool[key]) {
                  state.messagePool[key] = [];
              }

              if (row) {
                  state.messagePool[key].push(row);
              }
          })
      },
      // add_semantic_beam_search_results: (state, {payload}: {payload: any}) => {
      //     // === Handle pathNodes and pathRelations (for multi-hop paths) ===
      //     if (Array.isArray(payload.pathNodes) && Array.isArray(payload.pathRelations)) {
      //         const { pathNodes, pathRelations } = payload;
      //
      //         // Add path nodes (avoid duplicates)
      //         pathNodes.forEach((node) => {
      //             if (node && node.id) {
      //                 const exists = state.visualizeData.node.some(
      //                     (n) => n.id === node.id
      //                 );
      //                 if (!exists) {
      //                     state.visualizeData.node.push(node);
      //                 }
      //             }
      //         });
      //
      //         // Add edges between path nodes based on pathRelations
      //         for (let i = 0; i < pathRelations.length; i++) {
      //             const rel = pathRelations[i];
      //             const fromNode = pathNodes[i];
      //             const toNode = pathNodes[i + 1];
      //
      //             if (fromNode && toNode && rel && fromNode.id && toNode.id) {
      //                 state.visualizeData.edge.push({
      //                     from: fromNode.id,
      //                     to: toNode.id,
      //                     label: rel.type,
      //                 });
      //             }
      //         }
      //     }
      // },
      add_upload_bytes: (state, {payload}: {payload: any}) => {
        console.log("Upload Bytes: ", payload);
          const key = Object.keys(payload)[0];
          const node = payload[key];
          console.log("Node",node)
          const keys = Object.keys(payload);
          console.log("INSERT KEYS", keys);
          state.uploadBytes = payload;

          // if (!state.messagePool[key]) {
          //     state.messagePool[key] = [];
          // }
          //
          // if(node){
          //     state.messagePool[key].push(node);
          // }
      },
    add_visualize_data: (state, { payload }) => {
      console.log("PAYLOAD INSERT", payload);
    
      const keys = Object.keys(payload);
      console.log("INSERT KEYS", keys);
    
      
      const firstNode = { ...payload[keys[0]] };
      const secondNode = { ...payload[keys[1]] };
      const relation = payload[keys[2]];
      console.log("INSERT RELATION", relation);
      if(firstNode && secondNode && firstNode.id && secondNode.id){
        state.visualizeData.edge.push({ from: firstNode?.id, to: secondNode?.id , label: relation?.type});
      }
    
      // Process each key to add nodes, avoiding duplicates
      keys.forEach((key) => {
          if(key!="r") {
        const node = { ...payload[key] };
        if (node && node.id) {
          // Check if a node with the same id already exists
          const nodeExists = state.visualizeData.node.some(
            (existingNode) => existingNode.id === node.id
          );
          if (!nodeExists) {
            state.visualizeData.node.push(node);
          }
        }};
      });
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
    clear_visualize_data: (state) => {
      state.visualizeData = {
        node: [],
        edge: [],
      };
    },
  },
});

export const {
  add_query_result,
    add_semantic_result,
    add_upload_bytes,
  clear_result,
  add_visualize_data,
  clear_visualize_data,
  add_degree_data,
  clear_degree_data
} = queryDataSlice.actions;

export default queryDataSlice.reducer;
