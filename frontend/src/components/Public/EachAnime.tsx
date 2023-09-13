import {
  useGetAnimeByIdQuery,
  useGetCharactersByIdQuery,
} from "@/redux/api/animeApi";
import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info, PenSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddFavourites from "../myComp/AddFavourites";
import AddDialog from "../myComp/AddDialog";
import { Button } from "../ui/button";
import { useGetAnilistQuery } from "@/redux/api/anilistApi";
import EditDialog from "../myComp/EditDialog";
import AddReview from "../myComp/ReviewDialog";
import { useGetAllReviewQuery } from "@/redux/api/reviewApi";

const EachAnime: FC = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const {
    currentData: anime,
    isFetching,
    isError,
  } = useGetAnimeByIdQuery(id || "");
  const {
    currentData: characters,
    isFetching: charFetching,
    isError: charError,
  } = useGetCharactersByIdQuery(id || "");
  const { currentData: animeList } = useGetAnilistQuery();
  const { currentData: reviews } = useGetAllReviewQuery();

  const animeInList = animeList?.find((inList) => {
    const inListAnime = anime?.data.mal_id === inList.animeId;

    return inListAnime;
  });

  const demographics = anime?.data.demographics.map((items) => {
    return <span key={items.mal_id}>{items.name}</span>;
  });

  const chars = characters?.data
    .filter((char) => {
      const jpVoice = char.voice_actors.find((actor) => {
        return actor.language.includes("Japanese");
      });

      return jpVoice !== undefined;
    })
    .sort((a, b) => {
      return b.favorites - a.favorites;
    })
    .slice(0, 6);

  const final = chars
    ?.map((items) => {
      const jpVoice = items.voice_actors.find((actor) =>
        actor.language.includes("Japanese")
      );
      return {
        characters: items,
        voice_actor: jpVoice?.person,
      };
    })
    .sort((a, b) => {
      return a.characters.role.localeCompare(b.characters.role);
    });

  if (isError || charError) {
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

  if (isFetching || charFetching) {
    return (
      <span className="relative flex items-center justify-center after:content-[''] after:w-12 after:h-12 after:rounded-full after:animate-ping h-[calc(100vh-8rem)] after:bg-destructive/60" />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-y-4 lg:gap-y-0">
        <img
          src={anime?.data.images.webp.large_image_url}
          height={300}
          width={220}
          alt={anime?.data.title_english || anime?.data.title}
          className="rounded-sm h-full"
        />
        <Card id="scroll_id" className="h-full rounded-sm overflow-y-scroll">
          <CardHeader>
            <CardTitle className="text-[1.25rem]">
              {anime?.data.title_english || anime?.data.title}
            </CardTitle>
            <div className="hidden lg:flex items-center gap-x-3 text-base">
              <div className="flex items-center justify-center gap-x-2">
                <CardDescription>
                  <span>Score: </span>
                  <span>{anime?.data.score}</span>
                </CardDescription>
              </div>
              <Separator orientation="vertical" className="h-8 w-[1px]" />
              <div className="flex items-center gap-x-8">
                <div className="flex items-center justify-center gap-x-2">
                  <CardDescription>
                    <span>Ranked: </span>
                    <span>#{anime?.data.rank}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                  <CardDescription>
                    <span>Popularity: </span>
                    <span>#{anime?.data.popularity}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                  <CardDescription>
                    <span>Members: </span>
                    <span>{anime?.data.members}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                  <CardDescription>
                    <span>Rating: </span>
                    <span>{anime?.data.rating}</span>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[190px]">
            {anime?.data.synopsis}
          </CardContent>
        </Card>
        <div className="flex items-center justify-center lg:grid grid-cols-[220px_1fr] gap-x-5 lg:place-items-start">
          <Card className="rounded-sm mt-4 w-full lg:w-fit">
            <div>
              <div className="flex flex-col items-center justify-center mt-2 w-[94%] mx-auto space-y-1.5">
                {!animeInList ? (
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild className="w-full">
                      <Button className="w-full">Add To List</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>
                        Add {anime?.data.title_english || anime?.data.title}
                      </DialogTitle>
                      <AddFavourites animeById={anime} />
                      <AddDialog
                        animeById={anime}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild className="w-full">
                      <Button className="w-full">Edit Anime</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>
                        Edit {anime?.data.title_english || anime?.data.title}
                      </DialogTitle>
                      <AddFavourites animeById={anime} />
                      <EditDialog
                        items={animeInList}
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <div className="w-full inline-flex items-center justify-center gap-x-1 cursor-pointer">
                  <Button asChild variant="secondary" className="w-full">
                    <Link to="reviews">All Reviews</Link>
                  </Button>
                  <div className="inline-flex items-center justify-center">
                    <Dialog
                      open={reviewDialogOpen}
                      onOpenChange={setReviewDialogOpen}
                    >
                      <DialogTrigger>
                        <PenSquare
                          size={17}
                          className="bg-secondary p-[0.63rem] h-full w-fit rounded-md hover:bg-secondary/80 duration-150 cursor-pointer transition-colors"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle className="space-x-1">
                          <span>Review</span>
                          <span>
                            {anime?.data.title_english || anime?.data.title}
                          </span>
                        </DialogTitle>
                        <AddReview
                          animeById={anime!}
                          reviewDialogOpen={reviewDialogOpen}
                          setReviewDialogOpen={setReviewDialogOpen}
                          reviews={reviews!}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <CardTitle className="text-base px-4 py-2 mt-2 text-center md:text-start">
                Information <Separator className="w-full h-[1px]" />
              </CardTitle>
              <CardContent className="px-4 text-sm flex flex-col items-center text-center md:text-start md:items-start justify-center gap-y-3">
                <span>
                  <span className="mr-1.5">Type:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.type}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Episodes:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.episodes}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Status:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.status}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Aired:</span>
                  <span className="text-muted-foreground">
                    {anime?.data?.aired.string}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Producers:</span>
                  {anime?.data.producers.map((items, id) => {
                    if (id === anime?.data.producers.length - 1) {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name}
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name.concat(", ")}
                        </span>
                      );
                    }
                  })}
                </span>

                <span>
                  <span className="mr-1.5">Licensors:</span>
                  {anime?.data.licensors.map((items, id) => {
                    if (id === anime?.data.licensors.length - 1) {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name}
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name.concat(", ")}
                        </span>
                      );
                    }
                  })}
                </span>

                <span>
                  <span className="mr-1.5">Studios:</span>
                  {anime?.data.studios.map((studios) => {
                    return (
                      <span
                        className="text-muted-foreground"
                        key={studios.mal_id}
                      >
                        {studios.name}
                      </span>
                    );
                  })}
                </span>
                <span>
                  <span className="mr-1.5">Source:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.source}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Genres:</span>
                  {anime?.data.genres.map((items, id) => {
                    if (id === anime?.data.genres.length - 1) {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name}
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name.concat(", ")}
                        </span>
                      );
                    }
                  })}
                </span>

                <span>
                  <span className="mr-1.5">Themes:</span>
                  {anime?.data.themes.map((items, id) => {
                    if (id === anime?.data.themes.length - 1) {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name}
                        </span>
                      );
                    } else {
                      return (
                        <span
                          key={items.mal_id}
                          className="text-muted-foreground"
                        >
                          {items.name.concat(", ")}
                        </span>
                      );
                    }
                  })}
                </span>

                <span>
                  <span className="mr-1.5">Demographic:</span>
                  {demographics?.length === 0 ? (
                    <span className="text-muted-foreground">Unknown</span>
                  ) : (
                    demographics
                  )}
                </span>
                <span>
                  <span className="mr-1.5">Duration:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.duration}
                  </span>
                </span>
                <span>
                  <span className="mr-1.5">Rating:</span>
                  <span className="text-muted-foreground">
                    {anime?.data.rating}
                  </span>
                </span>
              </CardContent>
            </div>
          </Card>
        </div>
        <div className="mt-4 space-y-3">
          <Alert className="hidden lg:block rounded-sm px-4 py-2 space-x-1.5">
            <Info className="text-red-500 -mt-1.5" />
            <AlertTitle className="text-base">Background</AlertTitle>
            <AlertDescription>
              {anime?.data.background || "No details available"}
            </AlertDescription>
          </Alert>
          <div>
            <div>
              <h3 className="my-4 -mt-2 md:mt-6">
                Characters And Voice Actors
              </h3>
              {final?.map((items) => (
                <Card
                  key={items.characters.character.mal_id}
                  className="rounded-md w-full mt-5 lg:hidden"
                >
                  <CardContent className="flex items-center justify-between p-0 gap-x-4 pr-3">
                    <div className="h-full flex items-center gap-x-3">
                      <div className="w-[55px] h-full">
                        <img
                          className="w-full h-full rounded-none rounded-l-md"
                          src={
                            items.characters.character.images.webp?.image_url
                          }
                          width={55}
                          height={80}
                        />
                      </div>
                      <div className="h-full flex flex-col gap-y-6">
                        <span>{items.characters.character.name}</span>
                        <span>{items.characters.role}</span>
                      </div>
                    </div>
                    <div className="h-full flex items-center gap-x-3">
                      <div className="h-full flex flex-col gap-y-6 text-end">
                        <span>{items?.voice_actor?.name}</span>
                        <span>{items.characters.role}</span>
                      </div>
                      <div className="w-[55px] h-[80px]">
                        <img
                          className="h-full w-full rounded-none rounded-r-md"
                          src={items.voice_actor?.images.jpg.image_url}
                          width={55}
                          height={80}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Table className="w-full hidden lg:table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Character</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Language</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {final?.map((items) => {
                    return (
                      <TableRow key={items.characters.character.mal_id}>
                        <TableCell className="font-medium relative w-[124px]">
                          <img
                            src={
                              items.characters.character.images.webp?.image_url
                            }
                            alt={items.characters.character.name}
                            width={110}
                            height={110}
                            className="h-full w-full"
                          />
                        </TableCell>
                        <TableCell>{items.characters.character.name}</TableCell>
                        <TableCell>{items.characters.role}</TableCell>
                        <TableCell className="relative w-[124px]">
                          <img
                            src={items.voice_actor?.images.jpg.image_url}
                            alt={items.voice_actor?.name || "Not Available"}
                            width={110}
                            height={110}
                            className="w-full h-full -ml-8"
                          />
                        </TableCell>
                        <TableCell>{items.voice_actor?.name}</TableCell>
                        <TableCell className="text-right">Japanese</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachAnime;
