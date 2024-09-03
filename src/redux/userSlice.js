import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  last_name: "",
  role: "",
  email: "",
  token: "",
  expirationTime: null // Añade el tiempo de expiración
};

export const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.expirationTime = action.payload.expirationTime; // Guarda el tiempo de expiración
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;

export default userSlice.reducer;
