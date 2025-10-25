import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  created_at: "",
  form_active: false,
  initial_project_active: false,
  intermediate_project_active: false,
  final_project_active: false,
  pps_report_active: false
};

export const periodSlice = createSlice({
  name: "periodReducer",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearPeriod: () => {
      return initialState;
    },
    togglePeriodSetting: (state, action) => {
        const { field } = action.payload;
        state[field] = !state[field];
      },
  },
});

export const { setPeriod, clearPeriod, togglePeriodSetting } = periodSlice.actions;

export default periodSlice.reducer;
