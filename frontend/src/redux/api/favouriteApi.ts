import { FavoritesInAnilist } from "types/anilist";
import { anilistApi } from "./anilistApi";

export const favouriteApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFav: builder.query<FavoritesInAnilist[], string>({
      query: () => ({
        url: "/api/favourites",
      }),
      providesTags: ["Favourite"],
    }),

    addFav: builder.mutation<
      void,
      Partial<Omit<FavoritesInAnilist, "_id" | "user">>
    >({
      query: (data) => ({
        url: "/api/favourites",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Favourite"],
    }),

    delFav: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/favourites/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favourite"],
    }),
  }),
});

export const { useGetAllFavQuery, useAddFavMutation, useDelFavMutation } =
  favouriteApi;
