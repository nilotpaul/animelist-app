import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import {
  User,
  GetUser,
  UserRegisterBody,
  UserLoginBody,
  Message,
} from "@/../../types/user";
import { rtkError } from "types/custom.err";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/users",
  }) as BaseQueryFn<string | FetchArgs, unknown, rtkError, object>,

  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, UserRegisterBody>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation<User, UserLoginBody>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logutUser: builder.mutation<Message, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getUser: builder.query<GetUser, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useLogutUserMutation,
} = authApi;
