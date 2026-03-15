import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../validations/user';

export const AUTH_TOKEN_KEY = 'spectocare_auth_token';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    reset(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

export const { setUser, setToken, setLoading, reset } = authSlice.actions;
export default authSlice.reducer;
