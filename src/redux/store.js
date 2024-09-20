import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import periodReducer from "./periodSlice";
import userReducer from "./userSlice";

const persistUserConfig = {
  key: "user",
  storage,
};

const persistPeriodConfig = {
  key: "period",
  storage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

const persistedPeriodReducer = persistReducer(persistPeriodConfig, periodReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    period: persistedPeriodReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
