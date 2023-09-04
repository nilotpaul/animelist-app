import { FC } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import * as z from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useEditReviewMutation,
} from "@/redux/api/reviewApi";
import { AnimeById, Review } from "types/anilist";
import { useToast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";
import { useAppSelector } from "@/redux/store";

type AddReviewProps = {
  animeById: AnimeById;
  reviewDialogOpen?: boolean;
  setReviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
};

const AddReview: FC<AddReviewProps> = ({
  animeById,
  setReviewDialogOpen,
  reviews,
}) => {
  const [addRev, { error: apiAddErr }] = useAddReviewMutation();
  const [delRev, { error: apiDelErr }] = useDeleteReviewMutation();
  const [editRev, { error: apiEditErr }] = useEditReviewMutation();
  const { user } = useAppSelector((state) => state.userSlice);

  const { toast } = useToast();

  const reviewSchema = z.object({
    reviewTitle: z
      .string()
      .min(10, {
        message: "title must contain at least 10 character(s)",
      })
      .max(80, {
        message: "title must contain at most 100 character(s)",
      }),
    review: z
      .string()
      .min(50, {
        message: "review must contain at least 100 character(s)",
      })
      .nonempty()
      .max(300, {
        message: "max content limit reached",
      })
      .nonempty(),
  });

  type reviewSchema = z.infer<typeof reviewSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<reviewSchema>({
    resolver: zodResolver(reviewSchema),
  });

  const alreadyReviewed = reviews
    ?.filter((revs) => {
      return revs.animeId === animeById.data.mal_id;
    })
    .find((rev) => {
      return rev.user === user?.id;
    });

  console.log(alreadyReviewed);

  const addReview: SubmitHandler<reviewSchema> = async (formData) => {
    const data = {
      animeId: animeById.data.mal_id,
      image: animeById.data.images.webp.large_image_url,
      title: animeById.data.title_english || animeById.data.title,
      ...formData,
    };

    try {
      await addRev(data).unwrap();

      if (!apiAddErr) {
        reset();
        setReviewDialogOpen(false);
        toast({
          className: "text-success",
          title: "Review added",
        });
      }
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          variant: "destructive",
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  const delReview = async () => {
    try {
      await delRev(alreadyReviewed!._id).unwrap();

      if (!apiDelErr) {
        setReviewDialogOpen(false);
        toast({
          className: "text-destructive",
          title: "Review removed",
        });
      }
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          variant: "destructive",
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  const editReview = async (formData: reviewSchema) => {
    const data = {
      _id: alreadyReviewed!._id,
      ...formData,
    };

    try {
      await editRev(data).unwrap();

      if (!apiEditErr) {
        reset();
        setReviewDialogOpen(false);
        toast({
          className: "text-success",
          title: "Review edited",
        });
      }
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          variant: "destructive",
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          defaultValue={alreadyReviewed?.reviewTitle || ""}
          type="text"
          {...register("reviewTitle")}
        />
        <span className="text-destructive text-xs ml-2">
          {errors.reviewTitle?.message}
        </span>
      </div>
      <div className="space-y-2">
        <Label>Write Review</Label>
        <Textarea
          defaultValue={alreadyReviewed?.review || ""}
          className="h-44"
          placeholder="write review here..."
          {...register("review")}
        />
        <span className="text-destructive text-xs ml-2">
          {errors.review?.message}
        </span>
        <Alert variant="destructive">
          <AlertTitle>Note:</AlertTitle>
          <AlertDescription>
            Your review will be publicly visible to everyone
          </AlertDescription>
        </Alert>
      </div>
      <div className="w-full flex items-center justify-end gap-x-2 mt-4">
        {!alreadyReviewed ? (
          <Button onClick={handleSubmit(addReview)} className="self-end">
            Post
          </Button>
        ) : (
          <Button onClick={handleSubmit(editReview)}>Edit</Button>
        )}
        {alreadyReviewed && (
          <Button onClick={delReview} variant="destructive">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddReview;
