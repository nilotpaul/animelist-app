import { FC, useEffect, useState } from "react";
import Review from "./Review";
import AnimeList from "./AnimeList";
import AllFavourites from "./AllFavourites";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Progress } from "../ui/progress";
import { useGetAnilistQuery } from "@/redux/api/anilistApi";
import { useGetAllReviewQuery } from "@/redux/api/reviewApi";

const Dashboard: FC = () => {
  const [progress, setProgress] = useState(0);
  const { currentData: anilist, isFetching: aniFetch } = useGetAnilistQuery();
  const { currentData: revs, isError: revFetch } = useGetAllReviewQuery();

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

  if (aniFetch || revFetch) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div className="w-[100%] h-[100vh] space-y-14">
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
      </div>
      <div className="space-y-3">
        <h2 className="text-xl ml-2">Recently Added</h2>
        <AnimeList slice={7} />
      </div>
      <div>
        <AllFavourites />
      </div>
      <div className="pb-[4.5rem]">
        <Review className="no-underline" />
      </div>
    </div>
  );
};

export default Dashboard;
