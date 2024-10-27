import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import periodReducer from "./slices/periodSlice";
import userReducer from "./slices/userSlice";
import topicsReducer from "./slices/topicsSlice"; // Importa el topicsSlice
import tutorsReducer from "./slices/tutorsSlice"; // Importa el tutorsSlice
import groupsReducer from "./slices/groupsSlice"; // Importa el tutorsSlice
import studentsReducer from "./slices/studentsSlice";

const persistUserConfig = {
  key: "user",
  storage,
};

const persistPeriodConfig = {
  key: "period",
  storage,
};

const persistTopicsConfig = {
  key: "topics",
  storage,
};

const persistTutorsConfig = {
  key: "tutors",
  storage,
};

const persistGroupsConfig = {
  key: "groups",
  storage,
};

const persistStudentsConfig = {
  key: "students",
  storage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);
const persistedPeriodReducer = persistReducer(persistPeriodConfig, periodReducer);
const persistedTopicsReducer = persistReducer(persistTopicsConfig, topicsReducer);
const persistedTutorsReducer = persistReducer(persistTutorsConfig, tutorsReducer);
const persistedGroupsReducer = persistReducer(persistGroupsConfig, groupsReducer);
const persistedStudentsReducer = persistReducer(persistStudentsConfig, studentsReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    period: persistedPeriodReducer,
    topics: persistedTopicsReducer,       // Agrega el reducer de tópicos aquí
    tutors: persistedTutorsReducer,
    groups: persistedGroupsReducer,
    students: persistedStudentsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
