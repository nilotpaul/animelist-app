import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "types/user";

export type UserInitialState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: UserInitialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  isAuthenticated: localStorage.getItem("user") ? true : false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: () => {
      initialState;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
