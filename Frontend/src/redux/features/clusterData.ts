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