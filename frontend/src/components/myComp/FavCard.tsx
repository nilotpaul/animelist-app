import { FC } from "react";
import { CardContent } from "../ui/card";

import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { FavoritesInAnilist } from "types/anilist";
import { useDelFavMutation } from "@/redux/api/favouriteApi";
import { apiError } from "../../../helpers/apiError";
import { useToast } from "../ui/use-toast";

interface FavCardProps {
  favs: FavoritesInAnilist;
}

const FavCard: FC<FavCardProps> = ({ favs }) => {
  const [deleteFav, { error: delError }] = useDelFavMutation();

  const { toast } = useToast();

  const delFav = async () => {
    try {
      await deleteFav(favs._id).unwrap();
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
  };

  return (
    <CardContent key={favs._id} className="group p-0 relative">
      <X
        onClick={delFav}
        size={19}
        className="invisible absolute z-20 -top-2 -right-2 bg-destructive rounded-full p-[1.35px] group-hover:visible cursor-pointer"
      />
      <Link className=" h-[195px]" to={`/anime/${favs.animeId}`}>
        <div className="relative w-[130px] rounded-sm hover:bg-muted transition-colors duration-200">
          <img
            height={170}
            width={130}
            src={favs.image}
            alt={favs.title}
            className="rounded-sm w-full h-[195px]"
          />
        </div>
      </Link>
    </CardContent>
  );
};

export default FavCard;
