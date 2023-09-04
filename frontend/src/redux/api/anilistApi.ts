import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { AddAnimeRes, Anilist, EditAnilist } from "types/anilist";
import { rtkError } from "types/custom.err";

export const anilistApi = createApi({
  reducerPath: "anilistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }) as BaseQueryFn<string | FetchArgs, unknown, rtkError, object>,

  tagTypes: ["Anime", "Anilist", "Favourite", "Review"],
  endpoints: (builder) => ({
    getAnilist: builder.query<Anilist[], void>({
      query: () => ({
        url: "/api/anime",
      }),
      providesTags: ["Anilist"],
    }),

    addAnime: builder.mutation<
      AddAnimeRes,
      Partial<Omit<Anilist, "user" | "createdAt" | "updatedAt" | "_id">>
    >({
      query: (animeData) => ({
        url: "/api/anime",
        method: "POST",
        body: animeData,
      }),
      invalidatesTags: ["Anilist"],
    }),

    deleteAnime: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/anime/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Anilist"],
    }),

    editAnime: builder.mutation<void, Partial<EditAnilist>>({
      query: ({ _id, ...editAnimeData }) => ({
        url: `/api/anime/${_id}`,
        method: "PUT",
        body: editAnimeData,
      }),
      invalidatesTags: ["Anilist"],
    }),
  }),
});

export const {
  useGetAnilistQuery,
  useAddAnimeMutation,
  useDeleteAnimeMutation,
  useEditAnimeMutation,
} = anilistApi;
