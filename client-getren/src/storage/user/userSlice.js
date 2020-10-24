import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },

    logout: (state) => {
      state.data = null;
    }
  },
});

export const selectUserData = state => state.user.data;

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
