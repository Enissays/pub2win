import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import influencerReducer from './slices/influencerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    influencer: influencerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
