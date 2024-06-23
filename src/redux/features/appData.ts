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
