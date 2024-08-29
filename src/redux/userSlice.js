import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    last_name: "",
    role: "",
    email: "",
    token: ""
};

export const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
      setUser: (state, action) => {
        // return (state = action.payload);
        return { ...state, ...action.payload };
      },
      // setToken: (state, action) => {
      //   state.token = action.payload; // Añade una acción para actualizar el token
      // },
      clearUser: () => {
        return initialState;
      },
    },
  });
  
  export const { setUser, setToken, clearUser } = userSlice.actions;
  
  export default userSlice.reducer;