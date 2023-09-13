import {
  useGetAllAnimeQuery,
  useGetAnimeBySeasonQuery,
} from "@/redux/api/animeApi";
import { FC, useState } from "react";
import AnimeData from "../myComp/AnimeData";
import { Button } from "../ui/button";
import { useGetAnilistQuery } from "@/redux/api/anilistApi";
import SkeletonLoader from "../myComp/SkeletonLoader";
import AnimeSearch from "../myComp/AnimeSearch";

const AllAnime: FC = () => {
  const page =
    typeof window !== "undefined"
      ? localStorage.getItem("page")
        ? JSON.parse(localStorage.getItem("page")!)
        : null
      : null;

  const seasonPageNo =
    typeof window !== "undefined"
      ? localStorage.getItem("seasonPage")
        ? JSON.parse(localStorage.getItem("seasonPage")!)
        : null
      : null;

  const [onPage, setOnPage] = useState<number>(page || 1);
  const [seasonPage, setSeasonPage] = useState<number>(seasonPageNo || 1);
  const {
    currentData: anime,
    isError,
    isFetching,
  } = useGetAllAnimeQuery(onPage.toString() || "1");
  const {
    currentData: seasonAnime,
    isFetching: seasonFetching,
    isError: seasonError,
  } = useGetAnimeBySeasonQuery(seasonPage.toString() || "1");
  const { data: animeList } = useGetAnilistQuery();

  if (isError || seasonError) {
    return (
      <>
        <h3 className="text-red-600">OPPS! something went wrong</h3>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          className="mt-3"
        >
          Try Agin
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-inherit md:bg-[#0f0f11] w-full py-2 md:py-8 rounded-md">
        <h2 id="animebysearch" className="font-bold text-center">
          Anime By Search
        </h2>
        <AnimeSearch animeList={animeList!} />
      </div>
      <div className="bg-inherit md:bg-[#0f0f11] py-2 md:py-8 rounded-md">
        <h2 id="goats" className="font-bold text-center">
          Top Anime (Goats)
        </h2>
        <div className="grid grid-cols-card place-items-start place-content-center gap-y-8 mt-6">
          {!isFetching ? (
            <>
              {anime?.data
                ?.map((items) => {
                  return (
                    <div
                      key={items.mal_id}
                      className="relative w-[155px] cursor-pointer h-[220px]"
                    >
                      <AnimeData items={items} animeList={animeList} />
                    </div>
                  );
                })
                .slice(0, window.innerWidth <= 640 ? 6 : undefined)}
            </>
          ) : (
            <SkeletonLoader count={window.innerWidth <= 640 ? 6 : 16} />
          )}
        </div>
        <div className="text-center mt-16 space-x-4">
          {onPage > 1 ? (
            <Button
              onClick={() => {
                onPage > 1 ? setOnPage(onPage - 1) : undefined;
                window.localStorage.setItem("page", JSON.stringify(onPage - 1));
              }}
            >
              Previous
            </Button>
          ) : (
            <Button disabled>Previous</Button>
          )}
          <span>Page: {onPage}</span>
          <Button
            onClick={() => {
              onPage <= anime!.pagination.last_visible_page
                ? setOnPage(onPage + 1)
                : undefined;
              window.localStorage.setItem("page", JSON.stringify(onPage + 1));
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="bg-inherit md:bg-[#0f0f11] py-2 md:py-8 rounded-md">
        <h2 id="seasonal" className="font-bold text-center">
          Airing This Season
        </h2>
        <div className="grid grid-cols-card place-items-center place-content-center gap-y-8 mt-6">
          {!seasonFetching ? (
            <>
              {seasonAnime?.data
                ?.map((items) => {
                  return (
                    <div
                      key={items.title_japanese}
                      className="relative w-[155px] cursor-pointer h-[220px]"
                    >
                      <AnimeData items={items} animeList={animeList} />
                    </div>
                  );
                })
                .slice(0, window.innerWidth <= 640 ? 6 : undefined)}
            </>
          ) : (
            <SkeletonLoader count={window.innerWidth <= 640 ? 6 : 10} />
          )}
        </div>
        <div className="text-center mt-16 space-x-4">
          {seasonPage > 1 ? (
            <Button
              onClick={() => {
                seasonPage > 1 ? setSeasonPage(seasonPage - 1) : undefined;
                window.localStorage.setItem(
                  "seasonPage",
                  JSON.stringify(seasonPage - 1)
                );
              }}
            >
              Previous
            </Button>
          ) : (
            <Button disabled>Previous</Button>
          )}
          <span>Page: {seasonPage}</span>
          <Button
            onClick={() => {
              seasonPage <= seasonAnime!.pagination.last_visible_page
                ? setSeasonPage(seasonPage + 1)
                : undefined;
              window.localStorage.setItem(
                "seasonPage",
                JSON.stringify(seasonPage + 1)
              );
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllAnime;
