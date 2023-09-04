import { FC, useState } from "react";
import { Anilist } from "types/anilist";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Pencil } from "lucide-react";

import EditDialog from "./EditDialog";
import { Link } from "react-router-dom";
import EditFavAnilist from "./EditFavAnilist";

interface AnilistDataProps {
  items: Anilist;
}

const AnilistData: FC<AnilistDataProps> = ({ items }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="group relative w-[145px] cursor-pointer h-[210px]">
      <div className="invisible absolute top-1 right-1 z-20 group-hover:visible">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Pencil size={20} className="bg-gray-800 rounded-full p-[2.5px]" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit {items.title}</DialogTitle>
            <EditFavAnilist items={items} />
            <EditDialog
              items={items}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Link to={`/anime/${items.animeId}`}>
        <img
          src={items.image}
          height={145}
          width={145}
          alt={items.title}
          className="relative h-full rounded-sm"
        />
        <section className="text-sm leading-[1.1rem] absolute z-10 bottom-0 w-full break-words bg-slate-900 opacity-90 px-3 py-2 rounded-sm rounded-t-none">
          <span>{items.title}</span>
          <div className="font-normal flex items-center justify-between mt-2">
            <span>{items.episodes}</span>
            <span>{items.score}</span>
          </div>
        </section>
      </Link>
    </div>
  );
};

export default AnilistData;
