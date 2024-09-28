import { createSlice } from "@reduxjs/toolkit";

// Estado inicial con una lista vacía de tutores
const initialState = [];

// Crear el slice para manejar los tutores
export const tutorsSlice = createSlice({
  name: "tutorsReducer",
  initialState,
  reducers: {
    // Acción para establecer la lista de tutores
    setTutors: (state, action) => {
      return action.payload; // Devolver el nuevo estado
    },
    // Acción para limpiar la lista de tutores
    clearTutors: () => {
      return []; // Devolver una lista vacía
    },
  },
});

// Exportar las acciones
export const { setTutors, clearTutors } = tutorsSlice.actions;

// Exportar el reducer
export default tutorsSlice.reducer;
