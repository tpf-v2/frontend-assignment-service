import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  last_name: "",
  role: "",
  email: "",
  token: "",
  expirationTime: null, // Añade el tiempo de expiración
  form_answered: false,
  group_id: null,
  tutor: "",
  topic: "",
  teammates: [],
  period_id: ""
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
    setUserInfo: (state,action) => {
      state.form_answered = action.payload.form_answered;
      state.tutor = action.payload.tutor;
      state.group_id = action.payload.group_id;
      state.topic = action.payload.topic;
      state.teammates = action.payload.teammates;
      state.period_id = action.payload.period_id
    }
  },
});

export const { setUser, setToken, clearUser, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
