import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const studentSlice = createSlice({
  name: "studentsReducer",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      return action.payload;
    },
    clearStudents: () => {
      return [];
    },
  },
});

export const { setStudents, clearStudents } = studentSlice.actions;

export default studentSlice.reducer;
