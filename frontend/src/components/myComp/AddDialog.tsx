import { FC } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimeData, AnimeResponseFull } from "../../../types/anilist";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useAddAnimeMutation } from "@/redux/api/anilistApi";
import { toast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddDialogProps {
  items?: AnimeData;
  animeById?: AnimeResponseFull;
  isOpen?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDialog: FC<AddDialogProps> = ({ items, animeById, setIsOpen }) => {
  const addSchema = z.object({
    status: z.enum([
      "completed",
      "watching",
      "rewatching",
      "planning",
      "dropped",
      "paused",
    ]),
    episodes: z.coerce
      .number()
      .nonnegative()
      .gte(0)
      .lte(items?.episodes || animeById?.data.episodes || 0, {
        message: `This anime has max ${
          items?.episodes || animeById?.data.episodes
        } episodes`,
      }),
    score: z.coerce.number().nonnegative().lte(10).gte(0),
    comment: z.string().optional(),
  });

  type addSchema = z.infer<typeof addSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<addSchema>({
    resolver: zodResolver(addSchema),
    mode: "onChange",
  });

  const [addAnime, { error }] = useAddAnimeMutation();

  const handleClick = async (formData: addSchema) => {
    const body = {
      animeId: items?.mal_id || animeById?.data.mal_id,
      title:
        items?.title_english ||
        items?.title ||
        animeById?.data.title_english ||
        animeById?.data.title,
      image:
        items?.images.webp.large_image_url ||
        animeById?.data.images.webp.large_image_url,
      genres: items?.genres || animeById?.data.genres,
      studios: items?.studios || animeById?.data.studios,
      ...formData,
      lastAdded: Number(
        new Date().getDate() +
          new Date().getMonth() +
          new Date().getFullYear() +
          new Date().getTime()
      ),
    };

    try {
      const res = await addAnime(body).unwrap();

      if (!error) {
        toast({
          className: "text-success",
          title: `${res.title} added to list`,
        });

        setIsOpen(false);
      }
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          variant: "destructive",
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
    <>
      <div className="space-y-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="watching">Watching</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rewatching">Rewatching</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <span className="text-destructive ml-2 text-xs">
            {errors.status?.message}
          </span>
        </div>
        <div className="space-y-2">
          <Label>Score</Label>
          <Input
            defaultValue={0}
            max={10}
            min={0}
            type="number"
            {...register("score")}
          />
          <span className="text-destructive ml-2 text-xs">
            {errors.score?.message}
          </span>
        </div>
        <div className="space-y-2">
          <Label>Episode Progress</Label>
          <Input
            defaultValue={0}
            max={items?.episodes || animeById?.data.episodes}
            min={0}
            type="number"
            {...register("episodes")}
          />
          <span className="text-destructive ml-2 text-xs">
            {errors.episodes?.message}
          </span>
        </div>
        <div className="space-y-2">
          <Label>Comments</Label>
          <Textarea {...register("comment")} />
          <span className="text-destructive ml-2 text-xs">
            {errors.comment?.message}
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit((formData) => handleClick(formData))}>
          Save
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddDialog;
