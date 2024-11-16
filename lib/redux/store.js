// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import sharingReducer from './sharingSlice';

// Create and export the store
const store = configureStore({
  reducer: {
    sharing: sharingReducer,
  },
});

export default store;
