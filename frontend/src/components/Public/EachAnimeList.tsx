import {
  useGetPublicAnilistQuery,
  useGetPublicUsersQuery,
} from "@/redux/api/publicApi";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetAllReviewQuery } from "@/redux/api/reviewApi";
import { Button } from "../ui/button";
import { useGetAllFavQuery } from "@/redux/api/favouriteApi";

const EachAnimeList: FC = () => {
  const [progress, setProgress] = useState(0);
  const { user } = useParams();
  const { currentData: users, isFetching: pubUserFetch } =
    useGetPublicUsersQuery();
  const { currentData: revs, isFetching: allRevFetch } = useGetAllReviewQuery();

  const getUserIdByName = users?.find((users) => {
    const userMatched = users.name.split(" ")[0].toLowerCase() === user;

    return userMatched;
  });

  const { currentData: anilist, isFetching: pubAniFetch } =
    useGetPublicAnilistQuery(getUserIdByName?._id || "");

  const { currentData: favs } = useGetAllFavQuery("", {
    selectFromResult: ({ currentData }) => ({
      currentData: currentData?.filter((favs) => {
        return favs.user === getUserIdByName?._id;
      }),
    }),
  });

  useEffect(() => {
    const timer = setTimeout(() => setProgress(anilist!.length / 2), 600);
    return () => clearTimeout(timer);
  }, [anilist]);

  const calcAvgScore = anilist?.reduce((acc, item) => {
    if (anilist?.length === 0) {
      return 0;
    }
    return acc + item.score / anilist!.length;
  }, 0);

  const uniqueGenres = [
    ...new Set(
      anilist?.flatMap((items) => items.genres.map((genre) => genre.name))
    ),
  ];

  if (pubAniFetch || pubUserFetch || allRevFetch) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  const activity = anilist?.map((items) => {
    if (items.status === "completed") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Completed {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (items.status === "dropped") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Dropped {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (items.status === "paused") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Paused {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (items.status === "planning") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Planning {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (items.status === "rewatching") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Rewatching {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    } else if (items.status === "watching") {
      return (
        <Card key={items._id} className="rounded-md">
          <CardContent className="flex items-center justify-start p-0 gap-x-4 pr-3">
            <div className="w-[55px] h-[80px]">
              <Link to={`/anime/${items.animeId}`}>
                <img
                  className="w-full h-full rounded-none rounded-l-md"
                  src={items.image}
                  width={55}
                  height={80}
                />
              </Link>
            </div>
            <div>
              <span>Started {items.title}</span>
            </div>
          </CardContent>
        </Card>
      );
    }
  });

  const joinedOn = {
    day: new Date(getUserIdByName?.createdAt.toString() || "").getDate(),
    month: new Date(getUserIdByName?.createdAt.toString() || "").getMonth(),
    year: new Date(getUserIdByName?.createdAt.toString() || "").getFullYear(),
  };

  if (pubAniFetch || pubUserFetch || allRevFetch) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div>
      <div className=" bg-muted/60 rounded-xl p-2 px-4 flex items-center gap-x-6">
        <h2 className="text-2xl ml-2">{getUserIdByName?.name}</h2>
        <div className="space-x-1">
          <span>Joined on</span>
          <span>{joinedOn.day},</span>
          <span>{joinedOn.month},</span>
          <span>{joinedOn.year}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 place-content-center w-full gap-x-8 my-4">
        <div className="space-y-3">
          <h3 className="text-xl ml-2">Progress Tab</h3>
          <Card className="rounded-md">
            <CardContent className="flex flex-col justify-center items-center w-full pt-4">
              <div className="flex items-center justify-evenly w-full">
                <div className="flex flex-col items-center justify-center">
                  <span>{anilist?.length}</span>
                  <span>Total Anime</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span>{revs?.length}</span>
                  <span>Reviews</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span>
                    {parseInt(calcAvgScore?.toString() as string).toFixed(2)}
                  </span>
                  <span>Mean Score</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/95 p-3 rounded-b-md flex flex-col">
              <div className="w-full flex items-center justify-evenly space-x-2 font-normal">
                <span className="flex flex-col items-center justify-center after:content-[''] after:h-6 after:w-[1.25px] after:bg-red-600">
                  50
                </span>
                <span className="flex flex-col items-center justify-center after:content-[''] after:h-6 after:w-[1.25px] after:bg-red-600">
                  100
                </span>
                <span className="flex flex-col items-center justify-center after:content-[''] after:h-6 after:w-[1.25px] after:bg-red-600">
                  200
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </CardFooter>
          </Card>
          <div className="space-y-3">
            <h3 className="text-xl ml-2 pt-2">Genre Overview</h3>
            <Card className="rounded-md">
              <CardContent className="flex items-center justify-center gap-x-8 p-4">
                {uniqueGenres.length === 0 && (
                  <span className="ml-2">No genres!</span>
                )}
                {uniqueGenres
                  ?.map((genres, id) => {
                    return (
                      <div key={id}>
                        <Button variant="secondary">{genres}</Button>
                      </div>
                    );
                  })
                  .slice(0, 4)}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl ml-2 pt-2">Favorites</h3>
            <Card className="rounded-md">
              <CardContent className="flex items-center justify-evenly p-4">
                {favs
                  ?.map((fav) => {
                    return (
                      <div
                        key={fav._id}
                        className="w-[105px] h-[155px] rounded-md"
                      >
                        <Link to={`/anime/${fav.animeId}`}>
                          <img
                            src={fav.image}
                            height={155}
                            width={105}
                            alt={fav.title}
                            className="h-full w-full rounded-md cursor-pointer"
                          />
                        </Link>
                      </div>
                    );
                  })
                  .slice(0, 4)}
                {favs?.length === 0 && <span>No favorites!</span>}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-3 overflow-y-auto h-[585px]">
          <h3 className="text-xl ml-2">Activity</h3>
          <div className="w-full grid grid-cols-2 gap-4 place-content-center font-normal">
            {activity?.length === 0 && (
              <span className="ml-2">No data to show!</span>
            )}
            {activity?.slice(0, 12)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachAnimeList;
