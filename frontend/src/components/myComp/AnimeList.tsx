import { useGetAnilistQuery } from "@/redux/api/anilistApi";
import { FC } from "react";
import AnilistData from "./AnilistData";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type AnimeListProps = {
  slice?: number;
};

const AnimeList: FC<AnimeListProps> = ({ slice }) => {
  const { isError, isFetching, currentData } = useGetAnilistQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  if (isError) {
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
  const statusValue = searchParams.get("status");
  const sortValue = searchParams.get("sort");
  const titleChange = searchParams.get("title");

  const filtedredAnime = currentData
    ?.slice()
    .sort((a, b) => {
      return sortValue === "z-a"
        ? b.title.localeCompare(a.title)
        : sortValue === "score"
        ? b.score - a.score
        : sortValue === "lastadded"
        ? b.lastAdded - a.lastAdded
        : a.title.localeCompare(b.title);
    })
    .filter((items) => {
      return items.status === `${statusValue || "completed"}`;
    })
    .filter((items) => {
      return items.title
        .toLowerCase()
        .includes(titleChange?.toLowerCase() || "");
    });

  if (isFetching) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-x-8 ml-1">
        <div className="space-y-1">
          <Label className="ml-1">Filter</Label>
          <Input
            placeholder="by title..."
            type="text"
            onChange={(e) => {
              searchParams.set("title", e.target.value);
              setSearchParams(searchParams);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label className="ml-1">Status</Label>
          <Select
            defaultValue="completed"
            onValueChange={(value) => {
              searchParams.set("status", value);
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watching">Watching</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rewatching">Rewatching</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="ml-1">Sort</Label>
          <Select
            defaultValue="a-z"
            onValueChange={(value) => {
              searchParams.set("sort", value);
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="lastadded">Last Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtedredAnime?.length !== 0 ? (
        <div className="grid grid-cols-card place-items-start place-content-start gap-y-8 mt-6">
          {filtedredAnime
            ?.map((items) => {
              return (
                <div key={items._id}>
                  <AnilistData items={items} />
                </div>
              );
            })
            .slice(0, slice)}
        </div>
      ) : (
        <>
          <h3 className="mt-6">No entries available!</h3>
          <Button asChild className="h-7 px-3 mt-1.5">
            <Link to="/anime">Add Now</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AnimeList;
