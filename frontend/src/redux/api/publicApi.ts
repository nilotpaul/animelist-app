import { GetUser } from "types/user";
import { anilistApi } from "./anilistApi";
import { Anilist } from "types/anilist";

const publicApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicUsers: builder.query<GetUser[], void>({
      query: () => ({
        url: "/api/public/users",
      }),
      providesTags: ["Anilist", "Favourite", "Review"],
    }),

    getPublicAnilist: builder.query<Anilist[], string>({
      query: (id) => ({
        url: `/api/public/animelist/${id}`,
      }),
      providesTags: ["Anilist", "Favourite", "Review"],
    }),
  }),
});

export const { useGetPublicUsersQuery, useGetPublicAnilistQuery } = publicApi;
