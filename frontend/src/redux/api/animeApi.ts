import {
  AnimeCharacters,
  AnimeResponse,
  AnimeResponseFull,
  Filters,
} from "types/anilist";
import { anilistApi } from "./anilistApi";

export const animeApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAnime: builder.query<AnimeResponse, string>({
      query: (page) => ({
        url: `https://api.jikan.moe/v4/top/anime?page=${page || 1}&limit=16`,
        cache: "force-cache",
      }),
    }),

    getAnimeById: builder.query<AnimeResponseFull, string>({
      query: (id) => ({
        url: `https://api.jikan.moe/v4/anime/${id}/full`,
        cache: "force-cache",
      }),
    }),

    getAnimeBySeason: builder.query<AnimeResponse, string>({
      query: (page) => ({
        url: `https://api.jikan.moe/v4/seasons/now?page=${page || 1}&limit=10`,
        cache: "force-cache",
      }),
    }),

    getAnimeBySearch: builder.query<AnimeResponse, Partial<Filters>>({
      query: ({ name, order, page, type }) => ({
        url: `https://api.jikan.moe/v4/anime?q=${name || ""}&order_by=${
          order || "popularity"
        }&type=${type || "tv"}&page=${page || 1}&limit=16`,
        cache: "force-cache",
      }),
    }),

    getCharactersById: builder.query<AnimeCharacters, string>({
      query: (id) => ({
        url: `https://api.jikan.moe/v4/anime/${id}/characters`,
        cache: "force-cache",
      }),
    }),
  }),
});

export const {
  useGetAllAnimeQuery,
  useGetAnimeByIdQuery,
  useGetAnimeBySeasonQuery,
  useGetAnimeBySearchQuery,
  useGetCharactersByIdQuery,
} = animeApi;
