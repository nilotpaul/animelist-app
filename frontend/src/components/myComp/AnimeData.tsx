import { FC, useState } from "react";
import { Anilist, AnimeData as AnimeApiData } from "types/anilist";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddDialog from "./AddDialog";
import { Link } from "react-router-dom";
import EditDialog from "./EditDialog";
import AddFavourites from "./AddFavourites";

type AnimeDataProps = {
  items: AnimeApiData;
  animeList?: Anilist[];
};

const AnimeData: FC<AnimeDataProps> = ({ items, animeList }) => {
  const [isDiaOpen, setIsDiaOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const animeInList = animeList?.find((inList) => {
    const inListAnime = items.mal_id === inList.animeId;

    return inListAnime;
  });

  return (
    <>
      <HoverCard>
        <HoverCardTrigger className="relative group">
          <div className="invisible absolute z-20 top-1 right-1 group-hover:visible">
            {!animeInList ? (
              <Dialog open={isDiaOpen} onOpenChange={setIsDiaOpen}>
                <DialogTrigger>
                  <Plus size={18} className="bg-gray-800 rounded-full" />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    Add {items.title_english || items.title}
                  </DialogTitle>
                  <AddFavourites items={items} />
                  <AddDialog
                    items={items}
                    isOpen={isDiaOpen}
                    setIsOpen={setIsDiaOpen}
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                  <Pencil
                    size={20}
                    className="bg-gray-800 rounded-full p-[2.5px]"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit {items.title}</DialogTitle>
                  <AddFavourites items={items} />
                  <EditDialog
                    items={animeInList}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Link to={`/anime/${items.mal_id}`}>
            <img
              src={items.images.webp.large_image_url}
              height={220}
              width={150}
              alt={items.title_english || items.title}
              className="relative h-full rounded-sm"
            />
          </Link>
        </HoverCardTrigger>

        <HoverCardContent className="px-3 py-2 rounded-sm rounded-t-none break-words">
          <div>
            <div className="flex">
              <span>{items.title_english || items.title}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="inline-flex items-center gap-x-2">
                <span className="capitalize">{items.type || "unknown"}</span>
                <span>{items.year}</span>
              </div>
              <div>Score: {items.score}</div>
            </div>
          </div>
          <div className="mt-2">
            <div>
              {items.studios.map((studios) => {
                return <span key={studios.mal_id}>{studios.name}</span>;
              })}
            </div>
            <div className="inline-flex items-center gap-x-3">
              <span>{items.type}</span>
              <span>Episodes: {items.episodes}</span>
            </div>
          </div>
          <div className="mt-2">
            {items.genres.map((genres) => {
              return (
                <Button
                  key={genres.mal_id}
                  className="text-sm h-6 w-fit m-1 p-1.5"
                >
                  {genres.name}
                </Button>
              );
            })}
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default AnimeData;
