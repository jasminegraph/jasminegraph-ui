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

import { IClusterDetails } from "@/types/cluster-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IClusterData {
  selectedCluster: IClusterDetails | null;
}

const initialData: IClusterData = {
  selectedCluster: null,
};

export const clusterDataSlice = createSlice({
  name: "clusterData",
  initialState: initialData,
  reducers: {
    set_Selected_Cluster: (state, action: PayloadAction<IClusterDetails>) => {
      state.selectedCluster = action.payload;
    },
  },
});

export const {
  set_Selected_Cluster
} = clusterDataSlice.actions;

export default clusterDataSlice.reducer;