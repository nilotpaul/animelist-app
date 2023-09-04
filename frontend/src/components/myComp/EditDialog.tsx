import { FC } from "react";
import { Anilist } from "types/anilist";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useGetAnimeByIdQuery } from "@/redux/api/animeApi";
import {
  useDeleteAnimeMutation,
  useEditAnimeMutation,
} from "@/redux/api/anilistApi";
import { useToast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";

type EditDialogProps = {
  items: Anilist;
  isDialogOpen?: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditDialog: FC<EditDialogProps> = ({ items, setIsDialogOpen }) => {
  const { data: animeById } = useGetAnimeByIdQuery(items.animeId.toString());
  const [editAnime] = useEditAnimeMutation();
  const [delAnime] = useDeleteAnimeMutation();

  const { toast } = useToast();

  const editSchema = z.object({
    status: z
      .enum([
        "completed",
        "watching",
        "rewatching",
        "planning",
        "dropped",
        "paused",
      ])
      .default(items.status),
    episodes: z.coerce
      .number()
      .nonnegative()
      .gte(0)
      .lte(animeById?.data.episodes || 10000, {
        message: `This anime has max ${animeById?.data.episodes} episodes`,
      }),
    score: z.coerce.number().nonnegative().gte(0).lte(10),
    comment: z.string(),
  });

  type editSchema = z.infer<typeof editSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<editSchema>({
    resolver: zodResolver(editSchema),
    mode: "onChange",
  });

  const editAnimeEntry = async (formData: editSchema, _id: string) => {
    try {
      await editAnime({ _id, ...formData }).unwrap();

      setIsDialogOpen(false);
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        setIsDialogOpen(false);
        toast({
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        setIsDialogOpen(false);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  const deleteAnime = async (id: string) => {
    try {
      await delAnime(id).unwrap();

      setIsDialogOpen(false);
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        setIsDialogOpen(false);
        toast({
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        setIsDialogOpen(false);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  return (
    <>
      <div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={items.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
            defaultValue={items.score}
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
            defaultValue={items.episodes}
            max={animeById?.data?.episodes || undefined}
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
          <Textarea {...register("comment")} defaultValue={items.comment} />
          <span className="text-destructive ml-2 text-xs">
            {errors.comment?.message}
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSubmit((formData) =>
            editAnimeEntry(formData, items._id)
          )}
        >
          Save
        </Button>
        <Button variant="destructive" onClick={() => deleteAnime(items._id)}>
          Delete
        </Button>
      </DialogFooter>
    </>
  );
};

export default EditDialog;
