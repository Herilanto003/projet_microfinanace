import { createSlice } from "@reduxjs/toolkit";

let userInit = null;
try {
  const raw = localStorage.getItem("user");
  userInit = raw ? JSON.parse(raw) : null;
} catch {
  userInit = null;
}

const initialState = {
  user: userInit,
  token: localStorage.getItem("token") || null,
  isAuthenticated: localStorage.getItem("token") == null ? false : true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      (state.user = user), (state.token = token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      (state.user = null),
        (state.token = null),
        localStorage.removeItem("token");
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
