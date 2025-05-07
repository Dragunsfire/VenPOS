import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nombre: '',
  rol: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.nombre = action.payload.nombre;
      state.rol = action.payload.rol;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.nombre = '';
      state.rol = '';
      state.isAuthenticated = false;
    }
  }
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
