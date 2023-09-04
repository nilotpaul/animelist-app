import { cn } from "@/lib/utils";
import {
  useAddFavMutation,
  useDelFavMutation,
  useGetAllFavQuery,
} from "@/redux/api/favouriteApi";
import { FC } from "react";
import { AnimeData, AnimeResponseFull } from "types/anilist";
import { useToast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";

type AddFavouritesProps = {
  items?: AnimeData;
  animeById?: AnimeResponseFull;
};

const AddFavourites: FC<AddFavouritesProps> = ({ items, animeById }) => {
  const { currentData: favs } = useGetAllFavQuery("");
  const [addFav, { isError: addError }] = useAddFavMutation();
  const [delFav, { isError: delError }] = useDelFavMutation();

  const { toast } = useToast();

  const isFav = favs?.find((fav) => {
    return (
      fav.animeId === items?.mal_id || fav.animeId === animeById?.data.mal_id
    );
  });

  const handleClick = async () => {
    const data = {
      animeId: items?.mal_id || animeById?.data.mal_id,
      title:
        items?.title_english ||
        items?.title ||
        animeById?.data.title_english ||
        animeById?.data.title,
      image:
        items?.images.webp.large_image_url ||
        animeById?.data.images.webp.large_image_url,
    };

    if (isFav) {
      try {
        await delFav(isFav._id).unwrap();
        if (!delError) {
          toast({
            className: "text-destructive",
            title: "Removed from favorites",
          });
        }
      } catch (err) {
        console.log(err);
        if (apiError(err)) {
          toast({
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
    } else {
      try {
        await addFav(data).unwrap();
        if (!addError) {
          toast({
            className: "text-success",
            title: "Added to favorites",
          });
        }
      } catch (err) {
        console.log(err);
        if (apiError(err)) {
          toast({
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
    }
  };

  return (
    <i
      onClick={handleClick}
      className={
        !isFav
          ? cn("w-min ri-heart-fill m-0 p-0 cursor-pointer text-lg")
          : cn(
              "w-min ri-heart-fill m-0 p-0 cursor-pointer text-destructive text-lg"
            )
      }
    />
  );
};

export default AddFavourites;
