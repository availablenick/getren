import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js';

export default configureStore({
  reducer: {
    user: userReducer
  }
});
