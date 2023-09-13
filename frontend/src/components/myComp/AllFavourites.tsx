import { FC } from "react";
import { Card } from "../ui/card";
import { useGetAllFavQuery } from "@/redux/api/favouriteApi";

import FavCard from "./FavCard";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const AllFavourites: FC = () => {
  const { currentData: favs, isFetching } = useGetAllFavQuery("");

  if (isFetching) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div>
      <h3 className="text-xl">All Favorited Anime</h3>
      {favs?.length !== 0 ? (
        <Card
          id="card_scrollbar"
          className="flex lg:items-center lg:justify-center p-6 gap-x-9 rounded-sm mt-4 overflow-x-auto"
        >
          {favs?.map((favs) => {
            return <FavCard key={favs._id} favs={favs} />;
          })}
        </Card>
      ) : (
        <div className="ml-2 mt-3 space-y-2 text-destructive">
          <p>No Favorites Added!</p>
          <Button className="p-3 h-8">
            <Link to="/anime">Add Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllFavourites;
