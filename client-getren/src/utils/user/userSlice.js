import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    login: () => {},
    register: (state, action) => {
      state.email = action.email;
      state.password = action.password;
    },
  },
});

export const { login, register } = userSlice.actions;
export default userSlice.reducer;
