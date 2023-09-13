import { useGetAnimeBySearchQuery } from "@/redux/api/animeApi";
import { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SkeletonLoader from "./SkeletonLoader";
import AnimeData from "./AnimeData";
import { Anilist } from "types/anilist";
import { Button } from "../ui/button";

type AnimeSearchProps = {
  animeList: Anilist[];
};

const AnimeSearch: FC<AnimeSearchProps> = ({ animeList }) => {
  const searchPage =
    typeof window !== "undefined"
      ? localStorage.getItem("searchPage")
        ? JSON.parse(localStorage.getItem("searchPage")!)
        : null
      : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const [onPage, setOnPage] = useState(searchPage || 1);

  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const order = searchParams.get("orderBy");
  const filters = {
    page: onPage.toString() || "1",
    name: search || "",
    type: type || "tv",
    order: order || "popularity",
  };

  const {
    currentData: animeBySearch,
    isFetching: fetching,
    isError: err,
  } = useGetAnimeBySearchQuery(filters, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: false,
  });

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      searchParams.set("search", e.target.value);
      setSearchParams(searchParams);
    }, 2500);
  };

  if (err) {
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
    <div className="mt-6">
      <div className="flex items-center justify-center gap-6 md:gap-x-8 flex-wrap text-center md:text-start">
        <div className="space-y-1">
          <Label className="ml-2">Filter</Label>
          <Input
            defaultValue={search || ""}
            className="w-[280px]"
            placeholder="by title..."
            type="text"
            onChange={onNameChange}
          />
        </div>
        <div className="space-y-1">
          <Label className="ml-2">Type</Label>
          <Select
            defaultValue="tv"
            onValueChange={(value) => {
              searchParams.set("type", value);
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="tv">TV</SelectItem>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="ova">OVA</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="ml-2">OrderBy</Label>
          <Select
            defaultValue="popularity"
            onValueChange={(value) => {
              searchParams.set("orderBy", value);
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="scored_by">Score</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="favorites">Favorited</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-center space-y-1">
          <div className="flex items-center justify-center gap-x-2 mt-6">
            {onPage > 1 ? (
              <Button
                onClick={() => {
                  onPage > 1 ? setOnPage(onPage - 1) : undefined;
                  window.localStorage.setItem(
                    "searchPage",
                    JSON.stringify(onPage - 1)
                  );
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
                onPage <= animeBySearch!.pagination.last_visible_page
                  ? setOnPage(onPage + 1)
                  : undefined;
                window.localStorage.setItem(
                  "searchPage",
                  JSON.stringify(onPage + 1)
                );
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-card place-items-center place-content-center gap-y-8 mt-6">
        {animeBySearch?.data.length === 0 && (
          <p className="text-center ml-9">No anime found!</p>
        )}
        <>
          {fetching && (
            <SkeletonLoader count={window.innerWidth <= 640 ? 6 : 16} />
          )}
          {animeBySearch?.data
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
      </div>
    </div>
  );
};

export default AnimeSearch;
