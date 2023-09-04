import { Review } from "types/anilist";
import { anilistApi } from "./anilistApi";

export const reviewApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReview: builder.query<Review[], void>({
      query: () => ({
        url: "/api/reviews",
      }),
      providesTags: ["Review"],
    }),

    addReview: builder.mutation<
      void,
      Omit<Review, "user" | "_id" | "updatedAt" | "createdAt">
    >({
      query: (data) => ({
        url: "/api/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),

    editReview: builder.mutation<
      void,
      Pick<Review, "_id" | "reviewTitle" | "review">
    >({
      query: ({ _id, ...data }) => ({
        url: `/api/reviews/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllReviewQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
