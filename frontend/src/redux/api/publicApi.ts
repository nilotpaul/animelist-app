import { GetUser } from "types/user";
import { anilistApi } from "./anilistApi";
import { Anilist } from "types/anilist";

const publicApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicUsers: builder.query<GetUser[], void>({
      query: () => ({
        url: "/api/public/users",
      }),
    }),

    getPublicAnilist: builder.query<Anilist[], string>({
      query: (id) => ({
        url: `/api/public/animelist/${id}`,
        cache: "force-cache",
      }),
    }),
  }),
});

export const { useGetPublicUsersQuery, useGetPublicAnilistQuery } = publicApi;
