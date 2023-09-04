import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { anilistApi } from "./api/anilistApi";
import userSlice from "./slices/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [anilistApi.reducerPath]: anilistApi.reducer,
    userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, anilistApi.middleware),
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
