import { createSlice } from "@reduxjs/toolkit";

// Estado inicial con una lista vacía de tópicos
const initialState = [];

// Crear el slice para manejar los tópicos
export const groupsSlice = createSlice({
  name: "groupsReducer",
  initialState,
  reducers: {
    // Acción para establecer la lista de tópicos
    setGroups: (state, action) => {
      return action.payload; // Devolver el nuevo estado
    },
    // Acción para limpiar la lista de tópicos
    clearGroups: () => {
      return []; // Devolver una lista vacía
    },
  },
});

// Exportar las acciones
export const { setGroups, clearGroups } = groupsSlice.actions;

// Exportar el reducer
export default groupsSlice.reducer;
